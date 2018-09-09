from django.contrib.auth.backends import RemoteUserBackend


class AdRemoteUserBackend(RemoteUserBackend):
	def clean_username(self, username):
		return username.split("@")[0]
