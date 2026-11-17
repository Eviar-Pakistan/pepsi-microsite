from django.db import models


class User(models.Model):
    # Combined full name (first + last) for TrueFan / legacy
    name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=20, blank=True, default="")
    last_name = models.CharField(max_length=20, blank=True, default="")
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=20, blank=True, default="")
    pack_code = models.CharField(max_length=64, blank=True, default="")
    # Kept for older rows; no longer collected on the form
    city = models.CharField(max_length=80, blank=True, default="")
    privacy_consent = models.BooleanField(default=False)
    marketing_opt_in = models.BooleanField(default=False)
    age_confirmed = models.BooleanField(default=False)
    consent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class VideoJob(models.Model):
    STATUS_CHOICES = [
        ("queued", "queued"),
        ("processing", "processing"),
        ("validating", "validating"),
        ("success", "success"),
        ("rejected", "rejected"),
        ("failed", "failed"),
        ("timeout", "timeout"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="jobs")
    order_id = models.CharField(max_length=42, unique=True, db_index=True)
    video_id = models.CharField(max_length=64, blank=True, default="")
    template_id = models.CharField(max_length=64)
    vendor_id = models.CharField(max_length=16)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="queued", db_index=True)
    video_url = models.CharField(max_length=2048, blank=True, default="")
    rejection_reason = models.CharField(max_length=64, blank=True, default="")
    error_message = models.CharField(max_length=300, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.order_id
