<?php

class AdcpAutoLoader {
    public function autoloader($className) {
        $filename;
        //laad core app class
        if (preg_match('/^Adcp/', $className)) {
            $filename = ADCP_APP_DIR . '/system/core/' . $className;

        //load the specific application's class
        } else {
            $nameArr = explode('_', $className);
            
            $module = strtolower($nameArr[0]);
            
            //class directory
            $classDir = $nameArr[1];
            switch ($classDir) {
                case 'Controller':
                    $classDir = 'controllers';
                    break;

                case 'Model':
                    $classDir = 'models';
                    break;

                case 'Helper':
                    $classDir = 'helpers';
                    break;
            }

            //classname
            $className = $nameArr[2];

            //final class path
            $filename = ADCP_APP_DIR . '/system/apps/' . $module . '/' . $classDir . '/' . $className;
        }

        $filename = $filename . '.php';

        //Load Adcp System or Adcp Application Class
        if (file_exists($filename)) {
            return require_once $filename;
        }
    }
}