# Generated by Django 3.1 on 2020-10-13 04:54

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chatRoom', '0008_remove_message_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
