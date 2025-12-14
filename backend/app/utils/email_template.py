def get_verification_email_html(code: str, email: str) -> str:
    """HTML шаблон для письма с кодом подтверждения"""
    # Разбиваем код на отдельные цифры
    code_digits = list(code) if len(code) == 5 else ['', '', '', '', '']
    
    return f"""
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение email - Liberty</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 60px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #e5e5e5;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: #000000; font-family: 'Manrope', sans-serif;">
                                liberty
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; color: #000000; font-family: 'Manrope', sans-serif; text-align: center;">
                                Подтверждение email
                            </h2>
                            
                            <p style="margin: 0 0 40px; font-size: 14px; line-height: 1.6; color: #666666; font-family: 'Manrope', sans-serif; text-align: center;">
                                Мы отправили код подтверждения на email<br>
                                <strong style="color: #000000; font-weight: 500;">{email}</strong>
                            </p>
                            
                            <!-- Code Digits -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 40px;">
                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 60px; height: 70px; line-height: 70px; background-color: #ffffff; border-bottom: 2px solid #e5e5e5; text-align: center; font-size: 32px; font-weight: 600; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0;">
                                                        {code_digits[0]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 60px; height: 70px; line-height: 70px; background-color: #ffffff; border-bottom: 2px solid #e5e5e5; text-align: center; font-size: 32px; font-weight: 600; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0;">
                                                        {code_digits[1]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 60px; height: 70px; line-height: 70px; background-color: #ffffff; border-bottom: 2px solid #e5e5e5; text-align: center; font-size: 32px; font-weight: 600; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0;">
                                                        {code_digits[2]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 60px; height: 70px; line-height: 70px; background-color: #ffffff; border-bottom: 2px solid #e5e5e5; text-align: center; font-size: 32px; font-weight: 600; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0;">
                                                        {code_digits[3]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 60px; height: 70px; line-height: 70px; background-color: #ffffff; border-bottom: 2px solid #e5e5e5; text-align: center; font-size: 32px; font-weight: 600; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0;">
                                                        {code_digits[4]}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #999999; font-family: 'Manrope', sans-serif; text-align: center;">
                                Этот код действителен в течение 15 минут.<br>
                                Если вы не регистрировались на Liberty, просто проигнорируйте это письмо.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #fafafa; border-top: 2px solid #e5e5e5; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-family: 'Manrope', sans-serif;">
                                Made by <a href="https://pro-ai.uz/" style="color: #000000; text-decoration: underline; font-weight: 500;">PRO AI</a>
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #999999; font-family: 'Manrope', sans-serif;">
                                Tashkent, Uzbekistan
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    """

def get_verification_email_text(code: str) -> str:
    """Текстовая версия письма"""
    return f"""
LIBERTY - Подтверждение email

Ваш код подтверждения: {code}

Этот код действителен в течение 15 минут.

Если вы не регистрировались на Liberty, просто проигнорируйте это письмо.

---
Made by PRO AI
Tashkent, Uzbekistan
https://pro-ai.uz/
    """

