<?php

namespace als\Bind\Console;

use Illuminate\Console\Command;

class AddJs extends Command {

    protected $signature = 'bind:js';
    protected $description = 'Add bind.js to js folder';

    public function handle() {
        self::makeBindJs();
        self::addToApp();
        
    }

    private function addToApp() {
        $app = fopen('resources/js/app.js', "a") or die("Unable to open file!");
        $txt = "\nrequire('./bind');\n";
        fwrite($app, $txt);
        fclose($app);
    }

    private function makeBindJs() {
        $bindJs = fopen('resources/js/bind.js', "w") or die("Unable to open file!");
        $txt = "
import {ajax,listenTo,dom,WireDb} from '../../vendor/als/bind/src/bind';
window.dom = dom;


        ";
        fwrite($bindJs, $txt);
        fclose($bindJs);
    }


}
