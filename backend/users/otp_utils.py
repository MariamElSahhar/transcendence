import pyotp
from django.core.mail import send_mail
from django.utils import timezone


def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)
    return totp.now()


def send_otp(user):
    """
    Utility function to generate and send OTP
    """

    otp = generate_otp()
    user.email_otp = otp
    user.otp_created_at = timezone.now()
    user.save()
    send_mail(
        "Your Email OTP for 42AD Transcendence",
        f"Your OTP for email verification for 42AD Transcendence is: {otp}\nThis OTP is valid for 5 minutes.",
        "transcendence.42ad@gmail.com ",
        [user.email],
        fail_silently=False,
    )
