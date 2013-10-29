<?php

class Core_Model_City extends AdcpDbTable {

    /**
     * adcp_users table
     *
     * @var string
     */
    protected $_name = 'cities';
     /**
     * Gets city by cityId
     *
     * @param int $cityId
     * @return array
     */
    public function getCity($cityId) {
    }

    /**
     * Gets all cities
     *
     * @return string
     */
    public function getCities($state) {
        $html = "
            <option value=''>
                -- Ciudad --
            </option>";
        
        $select = $this->select(array("id","city"))
                        ->where("state = '$state'")
                        ->where("activated = '1'")
                        ->order("city");
        $resourse = $this->fetchAll($select);
        foreach ($resourse as $city){
            $html .= "
            <option value='".$city['id']."'>
                ".$city['city']."
            </option>";
        }
        echo $html;
    }

    /**
     * Create new system city
     *
     * @param array $city
     * @return void
     */
    public function createCity($city,$state) {
        
        $select = $this->select(array("city"))
                        ->where("city = '$city'")
                        ->where("state = '$state'");
	if ($this->numRows($select) == 1) {
            echo ('La ciudad ya existe!');
            return;
	}

	$this->begin();

        $this->insert(array('activated'=>'1','city'=>$city,'state'=>$state));
        
        $this->commit();
        
        echo ('La ciudad se creo correctamente!');
        
    }

    /**
     * Updates city's status (activated)
     *
     * @param int               $cityId
     * @param string            $status
     */
    public function updateCity($cityId, $status) {
    }

    /**
     * Desactivate cities
     *
     * @param int $cityId
     */
    public function desactivateCity($cityId) {
    }
}