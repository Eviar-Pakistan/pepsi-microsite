import re

from rest_framework import serializers

NAME_RE = re.compile(r"^[A-Za-z]+$")
EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
PHONE_RE = re.compile(r"^\+92[0-9]{10}$")
PACK_RE = re.compile(r"^[A-Za-z0-9]{5}$")
NAME_MAX = 10
PACK_MAX = 5


def _validate_name(value):
    value = value.strip()
    if not value:
        raise serializers.ValidationError("Please enter your name.")
    if " " in value or len(value.split()) > 1:
        raise serializers.ValidationError("Name must be a single word with no spaces.")
    if len(value) > NAME_MAX:
        raise serializers.ValidationError(f"Name must be {NAME_MAX} characters or fewer.")
    if any(ch.isdigit() for ch in value):
        raise serializers.ValidationError("Name cannot contain numbers.")
    if any(ord(c) < 32 for c in value) or not NAME_RE.fullmatch(value):
        raise serializers.ValidationError("Name can only use English letters (no spaces).")
    return value


class CreateVideoSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=NAME_MAX, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=20, trim_whitespace=True)
    packCode = serializers.CharField(max_length=PACK_MAX, trim_whitespace=True)
    privacyConsent = serializers.BooleanField()
    marketingOptIn = serializers.BooleanField(required=False, default=False)
    ageConfirmed = serializers.BooleanField()

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError({"non_field_errors": ["Invalid payload."]})
        if set(data.keys()) - set(self.fields):
            raise serializers.ValidationError({"non_field_errors": ["Unknown field."]})
        return super().to_internal_value(data)

    def validate_name(self, value):
        return _validate_name(value)

    def validate_email(self, value):
        value = value.strip().lower()
        if any(ord(c) > 127 for c in value) or not EMAIL_RE.fullmatch(value):
            raise serializers.ValidationError(
                "Enter a valid English email address (letters, numbers, and @ . _ % + - only)."
            )
        return value

    def validate_phone(self, value):
        value = value.strip().replace(" ", "")
        if not PHONE_RE.fullmatch(value):
            raise serializers.ValidationError(
                "Enter a valid Pakistani mobile number, e.g. +923001234567."
            )
        return value

    def validate_packCode(self, value):
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Please enter your pack code.")
        if not PACK_RE.fullmatch(value):
            raise serializers.ValidationError("Enter a valid 5-character pack code.")
        return value

    def validate_privacyConsent(self, value):
        if value is not True:
            raise serializers.ValidationError(
                "Please accept the Privacy Notice and Terms & Conditions."
            )
        return value

    def validate_ageConfirmed(self, value):
        if value is not True:
            raise serializers.ValidationError(
                "Please confirm you are over 18 and agree to the Terms & Conditions."
            )
        return value
