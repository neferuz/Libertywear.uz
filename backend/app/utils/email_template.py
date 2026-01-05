def get_verification_email_html(code: str, email: str) -> str:
    """HTML шаблон для письма с кодом подтверждения в стиле Liberty"""
    # Разбиваем код на отдельные цифры
    code_digits = list(code) if len(code) == 5 else ['', '', '', '', '']
    
    return f"""
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение email - Liberty</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #e5e5e5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e5e5e5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 50px 40px 40px; text-align: center; background-color: #000000;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 400; letter-spacing: 8px; text-transform: uppercase; color: #ffffff; font-family: 'Manrope', sans-serif;">
                                liberty
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 60px 40px 50px;">
                            
                            <!-- Welcome Text -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 0 30px; text-align: center;">
                                        <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; font-family: 'Manrope', sans-serif;">
                                            Подтверждение email
                                        </h2>
                                        <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #666666; font-family: 'Manrope', sans-serif;">
                                            Мы отправили код подтверждения на ваш email адрес
                                        </p>
                                        <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.6; color: #999999; font-family: 'Manrope', sans-serif;">
                                            {email}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Code Container -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px;">
                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="padding: 0 6px;">
                                                    <div style="display: inline-block; width: 56px; height: 70px; line-height: 70px; background-color: #fafafa; border: 2px solid #e5e5e5; text-align: center; font-size: 36px; font-weight: 700; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 4px;">
                                                        {code_digits[0]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 6px;">
                                                    <div style="display: inline-block; width: 56px; height: 70px; line-height: 70px; background-color: #fafafa; border: 2px solid #e5e5e5; text-align: center; font-size: 36px; font-weight: 700; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 4px;">
                                                        {code_digits[1]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 6px;">
                                                    <div style="display: inline-block; width: 56px; height: 70px; line-height: 70px; background-color: #fafafa; border: 2px solid #e5e5e5; text-align: center; font-size: 36px; font-weight: 700; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 4px;">
                                                        {code_digits[2]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 6px;">
                                                    <div style="display: inline-block; width: 56px; height: 70px; line-height: 70px; background-color: #fafafa; border: 2px solid #e5e5e5; text-align: center; font-size: 36px; font-weight: 700; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 4px;">
                                                        {code_digits[3]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 6px;">
                                                    <div style="display: inline-block; width: 56px; height: 70px; line-height: 70px; background-color: #fafafa; border: 2px solid #e5e5e5; text-align: center; font-size: 36px; font-weight: 700; color: #000000; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 4px;">
                                                        {code_digits[4]}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Text -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 20px 0 0; text-align: center;">
                                        <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #999999; font-family: 'Manrope', sans-serif;">
                                            Введите этот код на странице подтверждения для завершения регистрации
                                        </p>
                                        <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #cccccc; font-family: 'Manrope', sans-serif;">
                                            Код действителен в течение <strong style="color: #666666;">15 минут</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0 30px;">
                                <tr>
                                    <td style="padding: 0; border-top: 1px solid #e5e5e5;"></td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0; text-align: center;">
                                        <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #bbbbbb; font-family: 'Manrope', sans-serif;">
                                            Если вы не регистрировались на Liberty, просто проигнорируйте это письмо.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 12px;">
                                        <p style="margin: 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px; font-family: 'Manrope', sans-serif; font-weight: 500;">
                                            Made by <a href="https://pro-ai.uz/" style="color: #000000; text-decoration: none; font-weight: 600;">PRO AI</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 0;">
                                        <p style="margin: 0; font-size: 11px; color: #bbbbbb; font-family: 'Manrope', sans-serif;">
                                            Tashkent, Uzbekistan
                                        </p>
                                    </td>
                                </tr>
                            </table>
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

Введите этот код на странице подтверждения для завершения регистрации.

Если вы не регистрировались на Liberty, просто проигнорируйте это письмо.

---
Made by PRO AI
Tashkent, Uzbekistan
https://pro-ai.uz/
    """