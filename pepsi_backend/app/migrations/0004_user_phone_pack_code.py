from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0003_add_user_consents"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=20),
        ),
        migrations.AddField(
            model_name="user",
            name="pack_code",
            field=models.CharField(blank=True, default="", max_length=64),
        ),
        migrations.AlterField(
            model_name="user",
            name="city",
            field=models.CharField(blank=True, default="", max_length=80),
        ),
    ]
