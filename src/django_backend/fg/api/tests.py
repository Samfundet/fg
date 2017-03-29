from django.test import TestCase
from fg.api import models

TAG_DESCRIPTION = "bla bla this is the test description for tag"


class TagTestCase(TestCase):
    def setUp(self):
        pass

    def test_tag_has_name_and_description(self):
        models.Tag.objects.create(name="TestTag", description=TAG_DESCRIPTION)
        test_tag = models.Tag.objects.get(name="TestTag")
        self.assertEqual(test_tag.description, TAG_DESCRIPTION)

    def test_tags_retrieved_alphabetically(self):
        for i in range(0, 100):
            name = "Tag" + str(i)
            models.Tag.objects.create(name=name)

        tags = models.Tag.objects.all()
        for i in range(0, 100):
            name = "Tag" + str(i)
            tag = models.Tag.objects.get(name=name)
            self.assertEqual(tags[i].name, tag.name)

