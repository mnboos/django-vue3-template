from io import StringIO

from django.core.management import call_command
from rest_framework.test import APITransactionTestCase


class PrinturlsCommandTestCase(APITransactionTestCase):
    def test_printurls(self):
        out = StringIO()
        call_command("printurls", stdout=out)
        self.assertIn("api-root", out.getvalue())
