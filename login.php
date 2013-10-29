<?php
    $publico=true;
    $title="Login";
    require_once 'include/header.php';
    $logout = new Core_Controller_Login;
    $logout->logout();
?>
<script type="text/javascript" >
$(document).ready(function(){
    
    $(".icon-chevron-up").hide();
    $("#form-register").hide();
    $(".icon-chevron-down").click(function(){
        $(this).hide();
        $(this).next().show();
        $("#form-login").hide();
        $("#form-register").show();
    });
    $(".icon-chevron-up").click(function(){
        $(this).hide();
        $(this).prev().show();
        $("#form-login").show();
        $("#form-register").hide();
    });
        
});
</script>

<div class="login-form-top" id="form-login">
    <h1 class="header1"><?php echo ADCP_TITLE; ?> - Login</h1>
    <form>
        <table id="login-table">
            <tr> <td colspan="2"><div id="statusMsg"></div></td></tr>
            <tr> <td>Ususario : </td> <td> <input id="username" type="text" value="" /> </td> </tr>
            <tr> <td>Contraseña : </td> <td> <input id="password" type="password" value="" /> </td> </tr>
            <tr> <td></td><td style="text-align: left;"><input type="submit" id="do-login" value="Ingresar" /></td></tr>
        </table>
    </form>
</div>

    <a href="#" id="forgot-pass">Olvido Clave?</a>

    <div class="icon-chevron-down"> Registrese</div>
    <div class="icon-chevron-up"> Ingrese</div>
    
<div class="login-form-top" id="form-register">
    <h1 class="header1"><?php echo ADCP_TITLE; ?> - Registro</h1>
    <form>
        <table id="register-table">
            <tr> <td colspan="2"><div id="statusMsg_register"></div></td></tr>
            <tr> <td>Ususario : </td> <td> <input id="username_register" type="text" value="" /> </td> </tr>
            <tr> <td>Contraseña : </td> <td> <input id="password_register" type="password" value="" /> </td> </tr>
            <tr> <td>Confirmar contrase&ntilde;a : </td> <td> <input id="password_register_confirm" type="password" value="" /> </td> </tr>
            <tr> <td>Email : </td> <td> <input id="email_register" type="text" value="" /> </td> </tr>
            <tr> <td></td><td style="text-align: left;"><input type="submit" id="do-register" value="Registrarse" /></td></tr>
        </table>
    </form>
    <div class="login-form-bottom"></div>
</div>

<div id="reset-pass-dialog">
    Email: <input type="text" id="reset-pass-dialog-email" />
</div>

<?php
    require_once 'include/footer.php';
?>