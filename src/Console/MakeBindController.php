<?php

namespace als\Bind\Console;

use Illuminate\Console\Command;

class MakeBindController extends Command {

    protected $signature = 'bind:controller {name}';
    protected $description = 'Makes Bind controller';

    public function handle() {
        self::makeController();
        self::makeRoute();
        //$this->info('BindController and route are created');
    }

    private function routeTxt($name) {
        if(explode('.',\Illuminate\Foundation\Application::VERSION)[0] < 8) {
            return "\nRoute::resource('".lcfirst(str_replace('Controller','',$name))."','".$name."');\n";
        }
        else return "\nRoute::resource('".lcfirst(str_replace('Controller','',$name))."','App\\Http\\Controllers\\".$name."');\n";
    }


    private function makeRoute() {
        $route = fopen('routes/web.php', "a") or die("Unable to open file!");
        $txt = self::routeTxt($this->argument('name'));
        fwrite($route, $txt);
        fclose($route);
    }

    private function makeController() {
        $newController = fopen('app/Http/Controllers/'.$this->argument('name').'.php', "w") or die("Unable to open file!");
        $txt = '<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Als\Bind\BindController;


class '.$this->argument('name').' extends BindController
{
    public $tables = [];
    public $auth = false;

}
        ';
        fwrite($newController, $txt);
        fclose($newController);
    }


}
