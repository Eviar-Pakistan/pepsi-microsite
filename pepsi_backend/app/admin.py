from django.contrib import admin

from .models import User, VideoJob


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "city",
        "privacy_consent",
        "marketing_opt_in",
        "age_confirmed",
        "consent_at",
        "created_at",
    )
    list_filter = ("privacy_consent", "marketing_opt_in", "age_confirmed")
    search_fields = ("email", "name", "city")
    readonly_fields = (
        "name",
        "email",
        "city",
        "privacy_consent",
        "marketing_opt_in",
        "age_confirmed",
        "consent_at",
        "created_at",
    )

    def has_add_permission(self, request):
        return False


@admin.register(VideoJob)
class VideoJobAdmin(admin.ModelAdmin):
    list_display = ("order_id", "status", "created_at")
    search_fields = ("order_id",)
    list_filter = ("status",)
    readonly_fields = (
        "user",
        "order_id",
        "video_id",
        "template_id",
        "vendor_id",
        "status",
        "video_url",
        "rejection_reason",
        "error_message",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False
