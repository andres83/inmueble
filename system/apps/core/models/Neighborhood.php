<?php

class Core_Model_Neighborhood extends AdcpDbTable {

    /**
     * adcp_neighborhoods table
     *
     * @var string
     */
    protected $_name = 'neighborhoods';
     /**
     * Gets neighborhood by neighborhoodId
     *
     * @param int $neighborhoodId
     * @return array
     */
    public function getNeighborhood($neighborhoodId) {
    }

    /**
     * Gets all neighborhoods
     *
     * @return string
     */
    public function getNeighborhoods($city) {
        $html = "
            <option value=''>
                -- Barrio --
            </option>";
        
        $select = $this->select(array("id","neighborhood"))
                        ->where("city = '$city'")
                        ->where("activated = '1'")
                        ->order("neighborhood");
        $resourse = $this->fetchAll($select);
        foreach ($resourse as $neighborhood){
            $html .= "
            <option value='".$neighborhood['id']."'>
                ".$neighborhood['neighborhood']."
            </option>";
        }
        echo $html;
    }

    /**
     * Create new system neighborhood
     *
     * @param array $neighborhood
     * @return void
     */
    public function createNeighborhood($neighborhood, $city) {
        
        $select = $this->select(array("neighborhood"))
                        ->where("neighborhood = '$neighborhood'")
                        ->where("city = '$city'");
	if ($this->numRows($select) == 1) {
            echo ('El barrio ya existe!');
            return;
	}

	$this->begin();

        $this->insert(array('activated'=>'1','neighborhood'=>$neighborhood, 'city'=>$city));
        
        $this->commit();
        
        echo ('El barrio se creo correctamente!');
        
    }

    /**
     * Updates neighborhood's status (activated)
     *
     * @param int               $neighborhoodId
     * @param string            $status
     */
    public function updateNeighborhood($neighborhoodId, $status) {
    }

    /**
     * Desactivate neighborhoods
     *
     * @param int $neighborhoodId
     */
    public function desactivateNeighborhood($neighborhoodId) {
    }
}