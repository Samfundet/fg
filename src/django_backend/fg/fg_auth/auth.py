import pwd

from django.conf import settings

from fg.fg_auth.models import SecurityLevel, User


class KerberosBackend:
    def authenticate(self, request=None, remote_user=None):
        if remote_user:
            username = self.clean_username(remote_user)
            return self.get_or_create_user(username)
        else:
            return None

    def clean_username(self, username):
        return username.split('@')[0]

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def get_or_create_user(self, username):
        try:
            pwd.getpwnam(username)
        except KeyError:
            return None
        user, created = User.objects.get_or_create(
            username=username, password='KerberosPass')
        if created:
            user = self.configure_user(user)
        return user

    def configure_user(self, user):
        user.security_level = SecurityLevel.objects.get(name__iexact="Husfolk")
        user.email = '%s@%s' % (user.username, settings.MAIL_DOMAIN)
        try:
            passwd_entry = pwd.getpwnam(user.username)
            name = passwd_entry[4].split(',')[0].split()
            split = -1
            if len(name) > 3:
                split = -2
            user.first_name = ' '.join(name[:split])
            user.last_name = ' '.join(name[split:])
        except KeyError:
            pass

        try:
            import itkacl
            if itkacl.check("/web/fg", user.username):
                user.is_staff = True
                user.security_level = SecurityLevel.objects.get(name__iexact="FG")
        except ImportError:
            pass
        user.save()
        return user

    def has_perm(self, user_obj, perm, obj=None):
        try:
            import itkacl
            if perm == 'fg':
                return itkacl.check("/web/fg", user_obj.username)
            if perm == 'husfolk':
                return itkacl.check("/web/alle", user_obj.username)
        except ImportError:
            return False
        return False
