from django.db import models
from catalog.models import User_validable, User, Tag
from django.utils import timezone

class Kicked_out_user(models.Model):
    user = models.OneToOneField(User_validable, on_delete=models.NOT_PROVIDED)
    time = models.TimeField()
    def __str__(self):
        return self.user.username


class Message(models.Model):
    user = models.OneToOneField(User_validable, on_delete=models.NOT_PROVIDED)
    message = models.CharField(max_length=255)
    image = models.ImageField(upload_to="messages_images", blank=True)
    file = models.FileField(upload_to="messages_files", blank=True)
    time = models.TimeField()


class Chatroom(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    administrator = models.ManyToManyField(User_validable, related_name="Chat_administrators",)
    moderators = models.ManyToManyField(User_validable,  related_name="Chat_moderators", blank=True)
    tags = models.ManyToManyField(Tag, related_name="Chatroom_tags")
    users = models.ManyToManyField(User_validable,  related_name="Chat_users", blank=True)
    banned_users = models.ManyToManyField(User_validable,  related_name="Chat_banned", blank=True)
    kicked_out_user = models.ManyToManyField(Kicked_out_user,  related_name="Chat_kickeds", blank=True)
    messages = models.ManyToManyField(Message,  related_name="Chat_messages", blank=True)
    messages_per_minute = models.IntegerField()
    time_between_messages = models.IntegerField()
    max_users = models.IntegerField()
    duration = models.IntegerField(blank=True,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.name
