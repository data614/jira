from django.http import HttpResponse, JsonResponse

from plane.utils.monitoring import monitoring_service


def health_check(request):
    monitoring_service.record_public_endpoint(request)
    return JsonResponse(monitoring_service.run_checks())


def robots_txt(request):
    return HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")
