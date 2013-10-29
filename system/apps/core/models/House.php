<?php

class Core_Model_House extends AdcpDbTable {

    /**
     * adcp_users table
     *
     * @var string
     */
    protected $_name = 'houses';
     /**
     * Gets house by houseId
     *
     * @param int $houseId
     * @return array
     */
    public function getHouse($houseId) {
    }

    /**
     * Gets all houses
     *
     * @return string
     */
    public function getHouses() {
        $html = "
            <table>
                <tr>
                    <td>Departamento</td>
                    <td>Ciudad</td>
                    <td>Barrio</td>
                    <td>Direccion</td>
                    <td>Tipo</td>
                </tr>";
        
        $select = $this->select(array("address"))
                        ->join('spc_neighborhoods', 'spc_neighborhoods.id = spc_houses.neighborhood',array('neighborhood'))
                        ->join('spc_cities', 'spc_cities.id = spc_neighborhoods.city',array('city'))
                        ->join('spc_states', 'spc_states.id = spc_cities.state',array('state'))
                        ->join('spc_types', 'spc_types.id = spc_houses.type',array('type'))
                        ->where("spc_houses.activated = '1'")
                        ->where("spc_neighborhoods.activated = '1'")
                        ->where("spc_cities.activated = '1'")
                        ->where("spc_states.activated = '1'")
                        ->where("spc_types.activated = '1'");
        $resourse = $this->fetchAll($select);
        foreach ($resourse as $house){
            $html .= "
                <tr>
                    <td>".$house['state']."</td>
                    <td>".$house['city']."</td>
                    <td>".$house['neighborhood']."</td>
                    <td>".$house['address']."</td>
                    <td>".$house['type']."</td>
                </tr>";
        }
        $html .= "
            </table>";
        
        echo $html;
    }

    /**
     * Create new system house
     *
     * @param array $house
     * @return void
     */
    public function createHouse($house,$neighborhood,$type,$day) {
        
        $select = $this->select(array("address"))
                        ->where("address = '$house'")
                        ->where("neighborhood = '$neighborhood'")
                        ->where("type = '$type'");
	if ($this->numRows($select) == 1) {
            echo ('Esta direccion ya existe!');
            return;
	}

	$this->begin();

        $this->insert(array('activated'=>'1','address'=>$house, 'neighborhood'=>$neighborhood, 'type'=>$type, 'day'=>$day));
        
        $this->commit();
        
        echo ('Esta direccion se creo correctamente!');
    }

    /**
     * Updates house's status (activated)
     *
     * @param int               $houseId
     * @param string            $status
     */
    public function updateHouse($houseId, $status) {
    }

    /**
     * Desactivate houses
     *
     * @param int $houseId
     */
    public function desactivateHouse($houseId) {
    }
}