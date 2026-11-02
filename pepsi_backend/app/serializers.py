import re

from rest_framework import serializers

NAME_CITY_RE = re.compile(r"^[A-Za-z][A-Za-z\s'.-]{0,99}$")


class CreateVideoSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    city = serializers.CharField(max_length=80, trim_whitespace=True)
    privacyConsent = serializers.BooleanField()
    marketingOptIn = serializers.BooleanField(required=False, default=False)
    ageConfirmed = serializers.BooleanField()

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError("Invalid payload.")
        if set(data.keys()) - set(self.fields):
            raise serializers.ValidationError("Unknown field.")
        return super().to_internal_value(data)

    def validate_name(self, value):
        value = value.strip()
        if any(ch.isdigit() for ch in value):
            raise serializers.ValidationError("Name cannot contain numbers.")
        if any(ord(c) < 32 for c in value) or not NAME_CITY_RE.fullmatch(value):
            raise serializers.ValidationError("Enter a valid name.")
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_city(self, value):
        value = value.strip()
        if any(ch.isdigit() for ch in value):
            raise serializers.ValidationError("City cannot contain numbers.")
        if any(ord(c) < 32 for c in value) or not NAME_CITY_RE.fullmatch(value):
            raise serializers.ValidationError("Enter a valid city.")
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
