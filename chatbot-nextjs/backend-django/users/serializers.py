# users/serializers.py

from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Autenticamos con email y password
        user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Credenciales inválidas o usuario no encontrado.")
        if not user.is_active:
            raise serializers.ValidationError("Usuario inactivo.")

        data['user'] = user
        return data
