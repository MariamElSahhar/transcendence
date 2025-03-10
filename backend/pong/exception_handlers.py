from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_messages = []

        if isinstance(response.data, dict):
            for field, messages in response.data.items():
                if isinstance(messages, list):
                    error_messages.append(f"{field.capitalize()}: {' '.join(messages)}")
                else:
                    if field in ["detail", "non_field_errors"]:
                        error_messages.append(str(messages))
                    else:
                        error_messages.append(f"{field.capitalize()}: {str(messages)}")

        error_message = " ".join(error_messages)

        return Response({"error": error_message}, status=response.status_code)

    return response
