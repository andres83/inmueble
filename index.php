<?php
    //$publico=true;
    $title="Tu inmueble de Remate";
    require_once 'include/header.php';
?>
<script type="text/javascript" >
$(document).ready(function(){
    
	$("#logout").click(function () {
	    $.ajax({
	        type: "post",
	        dataType: "json",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/login/logout"
	        },
	        success: function () {
	            window.location.reload();
	        }
	    });
	});
        
        function loadHouses(){
            var house = $("#divHouses");
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/house/getHouses",
                        params: {
                        }
	        },
	        success: function (result) {
                    house.html(result);
	        }
	    });
        }
        loadHouses();
        
        function loadStates(){
            var state = $(".cbState");
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/state/getStates",
                        params: {
                        }
	        },
	        success: function (result) {
                    state.html(result);
                    state.change();
	        }
	    });
        }
        loadStates();
        
        function loadTypes(){
            var type = $(".cbType");
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/type/getTypes",
                        params: {
                        }
	        },
	        success: function (result) {
                    type.html(result);
                    type.change();
	        }
	    });
        }
        loadTypes();
        
        function loadCities(){
            var state = $(this).val();
            var city = $(this).parent().parent().find(".cbCity");
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/city/getCities",
                        params: {
                            state: state
                        }
	        },
	        success: function (result) {
                    city.html(result);
                    city.change();
	        }
	    });
        }
        
        function loadNeighborhood(){
            var city = $(this).val();
            var neighborhood = $(this).parent().parent().find(".cbNeighborhood");
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/neighborhood/getNeighborhoods",
                        params: {
                            city: city
                        }
	        },
	        success: function (result) {
                    neighborhood.html(result);
                    neighborhood.change();
	        }
	    });
        }
        
        $(".cbState").change(loadCities);
        
        $(".cbCity").change(loadNeighborhood);
        
	$("#btnAddState").click(function () {
            var state = $("#nameState").val();
            if(!state){
                alert("Por favor digite un departamento.");
                return;
            }
            $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/state/createState",
                        params: {
                            state: state
                        }
	        },
	        success: function (result) {
                    loadStates();
                    $("#nameState").val('');
                    $("#respuesta").html(result);
                    $("#respuesta").slideDown();
                    setTimeout(function () {
                        $("#respuesta").slideUp();
                    }, 3000);
	        }
	    });
	});
        
	$("#btnAddCity").click(function () {
            var city = $("#nameCity").val();
            var state = $("#fieldCity .cbState").val();
            if(!city){
                alert("Por favor digite una ciudad.");
                return;
            }
            if(!state){
                alert("Por favor seleccione un departamento.");
                return;
            }
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/city/createCity",
                        params: {
                            city: city,
                            state: state
                        }
	        },
	        success: function (result) {
                    $(".cbState").change();
                    $("#nameCity").val('');
                    $("#respuesta").html(result);
                    $("#respuesta").slideDown();
                    setTimeout(function () {
                        $("#respuesta").slideUp();
                    }, 3000);
	        }
	    });
	});
        
	$("#btnAddNeighborhood").click(function () {
            var neighborhood = $("#nameNeighborhood").val();
            var state = $("#fieldNeighborhood .cbState").val();
            var city = $("#fieldNeighborhood .cbCity").val();
            if(!neighborhood){
                alert("Por favor digite un barrio.");
                return;
            }
            if(!state){
                alert("Por favor seleccione un departamento.");
                return;
            }
            if(!city){
                alert("Por favor seleccione una ciudad.");
                return;
            }
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/neighborhood/createNeighborhood",
                        params: {
                            neighborhood: neighborhood,
                            city: city
                        }
	        },
	        success: function (result) {
                    $(".cbCity").change();
                    $("#nameNeighborhood").val('');
                    $("#respuesta").html(result);
                    $("#respuesta").slideDown();
                    setTimeout(function () {
                        $("#respuesta").slideUp();
                    }, 3000);
	        }
	    });
	});
        
	$("#btnAddType").click(function () {
            var type = $("#nameType").val();
            if(!type){
                alert("Por favor digite un tipo.");
                return;
            }
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/type/createType",
                        params: {
                            type: type
                        }
	        },
	        success: function (result) {
                    loadTypes();
                    $("#nameType").val('');
                    $("#respuesta").html(result);
                    $("#respuesta").slideDown();
                    setTimeout(function () {
                        $("#respuesta").slideUp();
                    }, 3000);
	        }
	    });
	});
        
	$("#btnAddHouse").click(function () {
            var house = $("#nameHouse").val();
            var state = $("#fieldHouse .cbState").val();
            var city = $("#fieldHouse .cbCity").val();
            var neighborhood = $("#fieldHouse .cbNeighborhood").val();
            var type = $("#fieldHouse .cbType").val();
            var day = $("#fieldHouse .date").val();
            if(!house){
                alert("Por favor digite una direccion.");
                return;
            }
            if(!state){
                alert("Por favor seleccione un departamento.");
                return;
            }
            if(!city){
                alert("Por favor seleccione una ciudad.");
                return;
            }
            if(!neighborhood){
                alert("Por favor seleccione un barrio.");
                return;
            }
            if(!type){
                alert("Por favor seleccione un tipo.");
                return;
            }
            if(!day){
                alert("Por favor seleccione una fecha.");
                return;
            }
	    $.ajax({
	        type: "post",
	        url: "AdcpEngine.php",
	        data: {
	        	adcpAppRequest: "core/house/createHouse",
                        params: {
                            house: house,
                            neighborhood: neighborhood,
                            type: type,
                            day: day
                        }
	        },
	        success: function (result) {
                    loadHouses();
                    $("#nameHouse").val('');
                    $("#respuesta").html(result);
                    $("#respuesta").slideDown();
                    setTimeout(function () {
                        $("#respuesta").slideUp();
                    }, 3000);
	        }
	    });
	});
        
        $( ".date" ).datepicker({dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true, yearRange: '0:+300'});
        //Hour picker http://jdewit.github.com/bootstrap-timepicker/
        
});
</script>

<div id="logout">LogOut</div>
<?php
if(isset($_SESSION['adcpUserPrefs']['role']) && $_SESSION['adcpUserPrefs']['role']=="admin" ){
?>
<ul class="tabs left">
<li><a href="#fieldHouse" title="Inmueble">Inmueble</a></li>
<li><a href="#fieldNeighborhood" title="Barrio">Barrio</a></li>
<li><a href="#fieldCity" title="Ciudad">Ciudad</a></li>
<li><a href="#fieldState" title="Departamento">Departamento</a></li>
<li><a href="#fieldType" title="Tipo">Tipo</a></li>
</ul>

<fieldset id="fieldHouse" class="tab-content">
    <label>Casa: 
        <input type="text" name="nameHouse" id="nameHouse"/>
    </label>
    <br/>
    <label>Departamento: 
        <select class="cbState">
            <option value="">
                -- Departamento --
            </option>
        </select>
    </label>
    <br/>
    <label>Ciudad: 
        <select class="cbCity">
            <option value="">
                -- Ciudad --
            </option>
        </select>
    </label>
    <br/>
    <label>Barrio: 
        <select class="cbNeighborhood">
            <option value="">
                -- Barrio --
            </option>
        </select>
    </label>
    <br/>
    <label>Tipo: 
        <select class="cbType">
            <option value="">
                -- Tipo --
            </option>
        </select>
    </label>
    <br/>
    <label>Fecha:
        <input type="text" class="date" />
    </label>
    <br/>
    <input type="button" name="btnAddHouse" id="btnAddHouse" Value="Agregar Casa"/>
    <br/>
</fieldset>

<fieldset id="fieldNeighborhood" class="tab-content">
    <label>Barrio: 
    <input type="text" name="nameNeighborhood" id="nameNeighborhood"/>
    </label>
    <br/>
    <label>Departamento: 
        <select class="cbState">
            <option value="">
                -- Departamento --
            </option>
        </select>
    </label>
    <br/>
    <label>Ciudad: 
        <select class="cbCity">
            <option value="">
                -- Ciudad --
            </option>
        </select>
    </label>
    <br/>
    <input type="button" name="btnAddNeighborhood" id="btnAddNeighborhood" Value="Agregar Barrio"/>
    <br/>
</fieldset>

<fieldset id="fieldCity" class="tab-content">
    <label>Ciudad: 
        <input type="text" name="nameCity" id="nameCity"/>
    </label>
    <br/>
    <label>Departamento: 
        <select class="cbState">
            <option value="">
                -- Departamento --
            </option>
        </select>
    </label>
    <br/>
    <input type="button" name="btnAddCity" id="btnAddCity" Value="Agregar Ciudad" />
    <br/>
</fieldset>

<fieldset id="fieldState" class="tab-content">
    <label>Departamento: 
        <input type="text" name="nameState" id="nameState"/>
    </label>
    <br/>
    <input type="button" name="btnAddState" id="btnAddState" Value="Agregar Departamento" />
    <br/>
</fieldset>

<fieldset id="fieldType" class="tab-content">
    <label>Tipo: 
        <input type="text" name="nameType" id="nameType"/>
    </label>
    <br/>
    <input type="button" name="btnAddType" id="btnAddType" Value="Agregar Tipo"/>
    <br/>
</fieldset>
<?php
}
?>

<div id="divHouses">
</div>

<?php
    require_once 'include/footer.php';
?>