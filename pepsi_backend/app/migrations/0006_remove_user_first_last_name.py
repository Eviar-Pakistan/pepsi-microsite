from django.db import migrations, models


def truncate_names(apps, schema_editor):
    User = apps.get_model("app", "User")
    for user in User.objects.all().iterator():
        raw = (user.name or "").strip()
        # Prefer first token of legacy "first last" rows, then cap at 10
        word = raw.split()[0] if raw else ""
        word = "".join(ch for ch in word if ch.isalpha())[:10]
        if user.name != word:
            user.name = word or "User"
            user.save(update_fields=["name"])


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0005_user_first_last_name"),
    ]

    operations = [
        migrations.RunPython(truncate_names, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="user",
            name="first_name",
        ),
        migrations.RemoveField(
            model_name="user",
            name="last_name",
        ),
        migrations.AlterField(
            model_name="user",
            name="name",
            field=models.CharField(max_length=10),
        ),
    ]
