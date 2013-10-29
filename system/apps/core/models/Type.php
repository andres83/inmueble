<?php

class Core_Model_Type extends AdcpDbTable {

    /**
     * adcp_users table
     *
     * @var string
     */
    protected $_name = 'types';
     /**
     * Gets type by typeId
     *
     * @param int $typeId
     * @return array
     */
    public function getType($typeId) {
    }

    /**
     * Gets all types
     *
     * @return string
     */
    public function getTypes() {
        $html = "
            <option value=''>
                -- Tipo --
            </option>";
        
        $select = $this->select(array("id","type"))
                        ->where("activated = '1'")
                        ->order("type");
        $resourse = $this->fetchAll($select);
        foreach ($resourse as $type){
            $html .= "
            <option value='".$type['id']."'>
                ".$type['type']."
            </option>";
        }
        echo $html;
    }

    /**
     * Create new system type
     *
     * @param array $type
     * @return void
     */
    public function createType($type) {
        
        $select = $this->select(array("type"))
                        ->where("type = '$type'");
	if ($this->numRows($select) == 1) {
            echo ('Este tipo ya existe!');
            return;
	}

	$this->begin();

        $this->insert(array('activated'=>'1','type'=>$type));
        
        $this->commit();
        
        echo ('Este tipo se creo correctamente!');
        
    }

    /**
     * Updates type's status (activated)
     *
     * @param int               $typeId
     * @param string            $status
     */
    public function updateType($typeId, $status) {
    }

    /**
     * Desactivate types
     *
     * @param int $typeId
     */
    public function desactivateType($typeId) {
    }
}