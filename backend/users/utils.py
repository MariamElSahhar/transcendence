from django.conf import settings
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
    # print(otp)
    send_mail(
        "Your Email OTP for 42AD Transcendence",
        f"Your OTP for email verification for 42AD Transcendence is: {otp}\nThis OTP is valid for 5 minutes.",
        "transcendence.42ad@gmail.com ",
        [user.email],
        fail_silently=False,
    )


# ADD ACCESS TOKEN COOKIE TO RESPONSE
def set_response_cookie(response, tokens, request):
    response.set_cookie(
        key=settings.SIMPLE_JWT["AUTH_COOKIE"],
        value=tokens["access"],
        expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh"],
        expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
    )
    return response
