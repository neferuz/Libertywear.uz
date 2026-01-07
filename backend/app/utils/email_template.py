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
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 50px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 60px 40px 50px; text-align: center; background: linear-gradient(135deg, #2c3b6e 0%, #1a2540 100%);">
                            <h1 style="margin: 0; font-size: 42px; font-weight: 300; letter-spacing: 12px; text-transform: uppercase; color: #ffffff; font-family: 'Manrope', sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                LIBERTY
                            </h1>
                            <div style="width: 60px; height: 2px; background-color: #ffffff; margin: 20px auto 0; opacity: 0.6;"></div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 60px 40px 50px;">
                            
                            <!-- Welcome Text -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 0 40px; text-align: center;">
                                        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #2c3b6e; font-family: 'Manrope', sans-serif;">
                                            Подтверждение email
                                        </h2>
                                        <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #666666; font-family: 'Manrope', sans-serif;">
                                            Мы отправили код подтверждения на ваш email адрес
                                        </p>
                                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2c3b6e; font-family: 'Manrope', sans-serif; font-weight: 500;">
                                            {email}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Code Container -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 50px 0;">
                                <tr>
                                    <td align="center" style="padding: 0 0 40px;">
                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 64px; height: 80px; line-height: 80px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #2c3b6e; text-align: center; font-size: 40px; font-weight: 700; color: #2c3b6e; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(44, 59, 110, 0.15);">
                                                        {code_digits[0]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 64px; height: 80px; line-height: 80px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #2c3b6e; text-align: center; font-size: 40px; font-weight: 700; color: #2c3b6e; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(44, 59, 110, 0.15);">
                                                        {code_digits[1]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 64px; height: 80px; line-height: 80px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #2c3b6e; text-align: center; font-size: 40px; font-weight: 700; color: #2c3b6e; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(44, 59, 110, 0.15);">
                                                        {code_digits[2]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 64px; height: 80px; line-height: 80px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #2c3b6e; text-align: center; font-size: 40px; font-weight: 700; color: #2c3b6e; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(44, 59, 110, 0.15);">
                                                        {code_digits[3]}
                                                    </div>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                    <div style="display: inline-block; width: 64px; height: 80px; line-height: 80px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #2c3b6e; text-align: center; font-size: 40px; font-weight: 700; color: #2c3b6e; font-family: 'Manrope', sans-serif; letter-spacing: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(44, 59, 110, 0.15);">
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
                                    <td style="padding: 30px 0 0; text-align: center;">
                                        <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #666666; font-family: 'Manrope', sans-serif;">
                                            Введите этот код на странице подтверждения для завершения регистрации
                                        </p>
                                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #999999; font-family: 'Manrope', sans-serif;">
                                            Код действителен в течение <strong style="color: #2c3b6e; font-weight: 600;">15 минут</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 50px 0 30px;">
                                <tr>
                                    <td style="padding: 0; border-top: 1px solid #e5e5e5;"></td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0; text-align: center;">
                                        <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #bbbbbb; font-family: 'Manrope', sans-serif;">
                                            Если вы не регистрировались на Liberty, просто проигнорируйте это письмо.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px 40px 35px; background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%); border-top: 2px solid #e5e5e5;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 15px;">
                                        <p style="margin: 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 3px; font-family: 'Manrope', sans-serif; font-weight: 500;">
                                            Powered by
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 0 0 12px;">
                                        <a href="https://pro-ai.uz/" style="text-decoration: none; display: inline-block;">
                                            <p style="margin: 0; font-size: 18px; color: #2c3b6e; text-transform: uppercase; letter-spacing: 4px; font-family: 'Manrope', sans-serif; font-weight: 700; transition: all 0.3s ease;">
                                                PRO AI
                                            </p>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 0;">
                                        <p style="margin: 0; font-size: 11px; color: #bbbbbb; font-family: 'Manrope', sans-serif; letter-spacing: 1px;">
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
═══════════════════════════════════════════════════════
                    LIBERTY
              Подтверждение email
═══════════════════════════════════════════════════════

Ваш код подтверждения: {code}

Этот код действителен в течение 15 минут.

Введите этот код на странице подтверждения для 
завершения регистрации.

Если вы не регистрировались на Liberty, просто 
проигнорируйте это письмо.

═══════════════════════════════════════════════════════
              Powered by PRO AI
Tashkent, Uzbekistan
https://pro-ai.uz/
═══════════════════════════════════════════════════════
    """