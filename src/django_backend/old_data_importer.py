import json

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
    "fg_auth.securitylevel": "api.security_level",
}


def foo():
    with open('../../../db.json') as json_data:
        data = json.load(json_data)
        job_pk = 0
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
                item["fields"]["date_taken"] = value

            elif item["model"] == "archive.tag":
                new_value = conversion_dict["archive.tag"]
                item["model"] = new_value
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
                item["model"] = new_value

            elif item["model"] == "archive.place":
                new_value = conversion_dict["archive.place"]
                item["model"] = new_value

                value = item["fields"]["place"]
                del item["fields"]["place"]
                item["fields"]["name"] = value

            elif item["model"] == "fg_auth.user" and item["fields"]["fg_info"] is not None:
                fg_info_pk = item["fields"]["fg_info"]
                item["fields"]["zip_code"] = str(item["fields"]["zip_code"]).zfill(4)
                for it in data:
                    if it["model"] == "fg_auth.fginfo" and it["pk"] == fg_info_pk:
                        # item["fields"]['gjengjobb1'] = it["fields"]["gjengjobb1"]
                        # item["fields"]['gjengjobb2'] = it["fields"]["gjengjobb2"]
                        # item["fields"]['gjengjobb3'] = it["fields"]["gjengjobb3"]
                        job_list = [it["fields"]["gjengjobb1"], it["fields"]["gjengjobb2"], it["fields"]["gjengjobb2"]]
                        job_pk_list = []
                        for job in job_list:
                            if len(job) > 1:
                                new_job = {
                                    "pk": job_pk,
                                    "model": "fg_auth.job",
                                    "fields": {
                                        "name": job,
                                        "description": "PLACEHOLDER"
                                    }
                                }
                                data.append(new_job)
                                job_pk_list.append(new_job["pk"])
                                job_pk += 1

                        item["fields"]['gjengjobber'] = job_pk_list
                        item["fields"]['aktiv_pang'] = it["fields"]["aktiv_pang"]
                        item["fields"]['fg_kallenavn'] = it["fields"]["fg_kallenavn"]
                        item["fields"]['comments'] = it["fields"]["comments"]
                        item["fields"]['hjemmeside'] = it["fields"]["hjemmeside"]
                        item["fields"]['bilde'] = it["fields"]["bilde"]
                        item["fields"]['opptaksaar'] = it["fields"]["opptaksaar"]
                        item["fields"]['uker'] = it["fields"]["uker"]

                        # Cleanup
                        del item["fields"]["fg_info"]
                        break

            elif item["model"] == "fg_auth.user" and item["fields"]["fg_info"] is None:
                del item["fields"]["fg_info"]
                print(item)

            # Delete unused objects
            # with open('new_db.json', 'w') as outfile:
            #     json.dump(data, outfile)


if __name__ == '__main__':
    foo()
