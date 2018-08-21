import json
import re
from dateutil.parser import parse
from datetime import date
from django.db import migrations
from django.utils.timezone import make_aware

conversion_dict = {
    "archive.imagemodel": "api.photo",
    "fields.image_prod": "fields.photo",
    "fields.tag": "fields.tags",
    "fields.date": "fields.date_taken",
    "archive.tag": "api.tag",
    "archive.category": "api.category",
    "fields.category": "fields.name",
    "fields.medium": "fields.name",
    "archive.media": "api.media",
    "archive.album": "api.album",
    "archive.place": "api.place",
    "fields.place": "fields.name",
    "fg_auth.securitylevel": "api.securitylevel",
    "fg_auth.downloadedimages": "api.userdownloadedphoto",
}


def migrate(apps, schema_editor):
    with open('db.json') as json_data:
        data = json.load(json_data)

        convert_to_new_model(data)
        cleaned_data = remove_models(data, [
            # "fg_auth.fginfo",
            "sessions.session",
            "info.site"
        ])

        here_models = {}
        for item in cleaned_data:
            here_models[item["model"]] = 'here'

        print(here_models)

        load_data(cleaned_data, apps, schema_editor)


def load_data(data, apps, schema_editor):
    """{'api.tag': 'here', 'api.category': 'here', 'api.media': 'here', 'api.album': 'here', 'api.place': 'here',
    'api.photo': 'here', 'api.securitylevel': 'here', 'fg_auth.user': 'here',
    'fg_auth.downloadedimages': 'here', 'fg_auth.job': 'here'}"""

    tag_objects = [item for item in data if item["model"] == "api.tag"]
    media_objects = [item for item in data if item["model"] == "api.media"]
    place_objects = [item for item in data if item["model"] == "api.place"]
    category_objects = [item for item in data if item["model"] == "api.category"]
    album_objects = [item for item in data if item["model"] == "api.album"]
    securitylevel_objects = [item for item in data if item["model"] == "api.securitylevel"]
    photo_objects = [item for item in data if item["model"] == "api.photo"]
    user_objects = [item for item in data if item["model"] == "fg_auth.user"]
    info_objects = [item for item in data if item["model"] == "fg_auth.fginfo"]
    # all_jobs = [item["fields"]["gjengjobber"] for item in data if item["model"] == "fg_auth.user"]
    # print(all_jobs)
    #
    # load_foreign_keys(tag_objects, "api", "Tag", apps)
    # load_foreign_keys(media_objects, "api", "Media", apps)
    # load_foreign_keys(place_objects, "api", "Place", apps)
    # load_foreign_keys(category_objects, "api", "Category", apps)
    # load_foreign_keys(album_objects, "api", "Album", apps)
    # load_foreign_keys(securitylevel_objects, "api", "SecurityLevel", apps)
    #
    # load_photos(photo_objects[0:100], apps)

    create_groups(apps)
    load_users(user_objects[0:100], apps, info_objects)


def create_groups(apps):
    """
    {"pk": 1, "model": "fg_auth.securitylevel", "fields": {"name": "FG"}},
    {"pk": 2, "model": "fg_auth.securitylevel", "fields": {"name": "Power"}},
    {"pk": 3, "model": "fg_auth.securitylevel", "fields": {"name": "Husfolk"}},
    {"pk": 4, "model": "fg_auth.securitylevel", "fields": {"name": "Alle"}}
    """
    Group = apps.get_model('auth', 'Group')
    fg = Group(name="FG")
    fg.save()
    power = Group(name="POWER")
    power.save()
    husfolk = Group(name="HUSFOLK")
    husfolk.save()


def load_jobs(apps):
    pass


def load_users(user_objects, apps, info_objects):
    # Job = apps.get_model("fg_auth", "Job")
    User = apps.get_model("fg_auth", "User")
    Group = apps.get_model('auth', 'Group')

    for item in user_objects:
        item["fields"]["pk"] = item["pk"]
        security_level = item["fields"]["security_level"]
        # gjengjobber = item["fields"]["gjengjobber"]
        del item["fields"]["security_level"]
        # del item["fields"]["gjengjobber"]
        del item["fields"]["groups"]
        del item["fields"]["user_permissions"]

        print(info_objects)
        fg_info = [inf["fields"] for inf in info_objects if inf["pk"] == item["fields"]["fg_info"]][0]
        del item["fields"]["fg_info"]
        item["fields"]["aktiv_pang"] = fg_info["aktiv_pang"]
        item["fields"]["fg_kallenavn"] = fg_info["fg_kallenavn"]
        item["fields"]["comments"] = fg_info["comments"]
        item["fields"]["hjemmeside"] = fg_info["hjemmeside"]
        item["fields"]["bilde"] = fg_info["bilde"]
        item["fields"]["opptaksaar"] = fg_info["opptaksaar"]
        item["fields"]["uker"] = fg_info["uker"]

        print(item["fields"])
        obj = User(**item["fields"])
        obj.save()
        # for jobb in gjengjobber:
        #     obj.gjengjobber.add(jobb)

        if security_level in [1, 2, 3]:
            obj.groups.add(
                Group.objects.get(
                    name="FG" if security_level == 1 else "POWER" if security_level == 2 else "HUSFOLK"
                )
            )


def load_photos(model_objects, apps):
    Photo = apps.get_model("api", "Photo")

    Album = apps.get_model("api", "Album")
    Category = apps.get_model("api", "Category")
    Place = apps.get_model("api", "Place")
    Media = apps.get_model("api", "Media")
    SecurityLevel = apps.get_model("api", "SecurityLevel")
    Tag = apps.get_model("api", "Tag")

    for item in model_objects:
        item["fields"]["album"] = Album.objects.get(pk=item["fields"]["album"])
        item["fields"]["category"] = Category.objects.get(pk=item["fields"]["category"])
        item["fields"]["place"] = Place.objects.get(pk=item["fields"]["place"])
        item["fields"]["media"] = Media.objects.get(pk=item["fields"]["media"])
        item["fields"]["security_level"] = SecurityLevel.objects.get(pk=item["fields"]["security_level"])

        tags_pk = item["fields"]["tags"]
        tags = Tag.objects.filter(pk__in=tags_pk)
        del item["fields"]["tags"]

        obj = Photo(**item["fields"])
        obj.save()
        for tag in tags:
            obj.tags.add(tag)


def load_foreign_keys(model_objects, app_name, model_name, apps):
    Mod = apps.get_model(app_name, model_name)
    obj_list = []
    for item in model_objects:
        obj = Mod(**item["fields"])
        obj_list.append(obj)

    Mod.objects.bulk_create(obj_list)


def remove_models(data, model_list):
    cleaned_list = [item for item in data if item["model"] not in model_list]
    return cleaned_list


def convert_to_new_model(data):
    items_to_delete = []
    for item in data:
        if item["model"] == "archive.imagemodel":
            new_value = conversion_dict["archive.imagemodel"]
            item["model"] = new_value

            value = item["fields"]["image_prod"]
            del item["fields"]["image_prod"]
            del item["fields"]["image_thumb"]
            del item["fields"]["image_web"]
            item["fields"]["photo"] = value

            value = item["fields"]["tag"]
            del item["fields"]["tag"]
            item["fields"]["tags"] = value

            value = item["fields"]["date"]
            del item["fields"]["date"]
            item["fields"]["date_taken"] = make_aware(parse(value))
            item["fields"]["date_modified"] = value

            if item["fields"]["album"] == 130:
                item["fields"]["album"] = 128

            item["fields"]["on_home_page"] = False

            if len(item["fields"]["motive"]) > 256:
                item["fields"]["motive"] = "Historisk Festmøte"
                item["fields"]["description"] = \
                    "Alle gamle formenn som møtte. Fra venstre:  " \
                    "Hans Einar Bøhn (V-54), Jarand Rystad (88/89), " \
                    "Erik Skolem (V-80), " \
                    "Tove Knutsen (V-79=, " \
                    "Harald Arvesen (H-61), " \
                    "Mari Raunsgard (05/06), " \
                    "Ketil Mozfeldt (H-47), " \
                    "Arild Nystad (H-71), " \
                    "Kari Klemmetsrud (01/02), " \
                    "Håvard Hamnaberg (02/03), " \
                    "Maryann Knutsen (H-84), " \
                    "Marie Sigmundsdatter Stølen (08/09), " \
                    "Truls Gjestland (V-68), Sverre E Lorentzen (V-74), " \
                    "Per Krogstie (H-54), " \
                    "Lene Bakke (H-70), " \
                    "Leif Erik Ødegaard (09/10), " \
                    "Øyvind Aass (07/08), Foran i stolen: Mari Haukaas Normann (10/11)"

        elif item["model"] == "archive.tag":
            new_value = conversion_dict["archive.tag"]
            item["model"] = new_value
            del item["fields"]["description"]
        elif item["model"] == "archive.category":
            new_value = conversion_dict["archive.category"]
            item["model"] = new_value

            value = item["fields"]["category"]
            del item["fields"]["category"]
            item["fields"]["name"] = value

        elif item["model"] == "archive.media":
            new_value = conversion_dict["archive.media"]
            item["model"] = new_value

            value = item["fields"]["medium"]
            del item["fields"]["medium"]
            item["fields"]["name"] = value

        elif item["model"] == "archive.album":
            new_value = conversion_dict["archive.album"]
            if item["pk"] == 130:
                items_to_delete.append(item)
            else:
                item["model"] = new_value
                year_reg = re.search("\\b(19|20)\d{2}\\b", item["fields"]["description"])
                item["fields"]["date_created"] = str(
                    date(int(year_reg.group(0)), 2, 15).strftime("%Y-%m-%d %H:%M:%S")
                ) if year_reg else str(
                    date(2000, 2, 15)
                )

        elif item["model"] == "archive.place":
            new_value = conversion_dict["archive.place"]
            item["model"] = new_value

            value = item["fields"]["place"]

            del item["fields"]["place"]
            item["fields"]["name"] = value

        elif item["model"] == "fg_auth.securitylevel":
            new_value = conversion_dict["fg_auth.securitylevel"]
            item["model"] = new_value

        elif item["model"] == "fg_auth.downloadedimages":
            new_value = conversion_dict["fg_auth.downloadedimages"]
            item["model"] = new_value
            item["fields"]["photo"] = item["fields"]["image"]
            del item["fields"]["image"]

        # elif item["model"] == "fg_auth.user" and item["fields"]["fg_info"] is not None:
        #     fg_info_pk = item["fields"]["fg_info"]
        #     item["fields"]["zip_code"] = str(item["fields"]["zip_code"]).zfill(4)
            # for it in data:
            #     if it["model"] == "fg_auth.fginfo" and it["pk"] == fg_info_pk:
            #         item["fields"]['gjengjobber'] = [
            #             it["fields"]["gjengjobb1"],
            #             it["fields"]["gjengjobb2"],
            #             it["fields"]["gjengjobb2"],
            #         ]
            #         item["fields"]['aktiv_pang'] = it["fields"]["aktiv_pang"]
            #         item["fields"]['fg_kallenavn'] = it["fields"]["fg_kallenavn"]
            #         item["fields"]['comments'] = it["fields"]["comments"]
            #         item["fields"]['hjemmeside'] = it["fields"]["hjemmeside"]
            #         item["fields"]['bilde'] = it["fields"]["bilde"]
            #         item["fields"]['opptaksaar'] = it["fields"]["opptaksaar"]
            #         item["fields"]['uker'] = it["fields"]["uker"]
            #
            #         # Cleanup
            #         print()
            #         del item["fields"]["fg_info"]
            #         del it["fields"]["gjengjobb1"]
            #         del it["fields"]["gjengjobb2"]
            #         del it["fields"]["gjengjobb2"]
            #         break

        elif item["model"] == "fg_auth.user" and item["fields"]["fg_info"] is None:
            del item["fields"]["fg_info"]

    [data.remove(item) for item in items_to_delete]


def iso_8601_format(dt):
    """YYYY-MM-DDThh:mm:ssTZD (1997-07-16T19:20:30-03:00)"""

    if dt is None:
        return ""

    fmt_datetime = dt.strftime('%Y-%m-%dT%H:%M:%S')
    tz = dt.utcoffset()
    if tz is None:
        fmt_timezone = "+00:00"
    else:
        fmt_timezone = str.format('{0:+06.2f}', float(tz.total_seconds() / 3600))

    return fmt_datetime + fmt_timezone


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
        ('fg_auth', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(migrate)
    ]