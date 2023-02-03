from django.core.management.base import BaseCommand

from api.urls import router


class Command(BaseCommand):
    help = "Prints all the urlpatterns from the api"

    def handle(self, *args, **options):
        class bcolors:
            HEADER = "\033[95m"
            OKBLUE = "\033[94m"
            OKCYAN = "\033[96m"
            OKGREEN = "\033[92m"
            WARNING = "\033[93m"
            FAIL = "\033[91m"
            ENDC = "\033[0m"
            BOLD = "\033[1m"
            UNDERLINE = "\033[4m"

        maxlen = 0
        for u in router.get_urls():
            maxlen = max(maxlen, len(u.name))

        urls_sorted = sorted(router.get_urls(), key=lambda pattern: str(pattern.pattern))
        for u in urls_sorted:
            name = u.name.ljust(maxlen)
            o = f"{bcolors.OKBLUE}{name}{bcolors.ENDC}  {bcolors.WARNING}{u.pattern}{bcolors.ENDC}"
            self.stdout.write(o)
