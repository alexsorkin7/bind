<?php

namespace Als\Bind;


use Illuminate\Support\ServiceProvider;
use Als\Bind\Http\Controllers\BindController;

class BindServiceProvider extends ServiceProvider {

    public function boot() {
    }

    public function register() {
        $this->commands([
            Console\MakeBindController::class,
            Console\AddJs::class,
        ]);
    }
}
