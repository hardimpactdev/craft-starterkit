<?php

namespace App\Support\Csp\Presets;

use Spatie\Csp\Directive;
use Spatie\Csp\Policy;
use Spatie\Csp\Preset;

class Development implements Preset
{
    public function configure(Policy $policy): void
    {
        /** @var string $appUrl */
        $appUrl = config('app.url');

        $appDomain = explode('://', $appUrl)[1];

        if (app()->isLocal()) {
            // Allow Vite to connect to the development server
            $policy
                ->add(Directive::CONNECT, ['wss://'.$appDomain.':*', 'https://'.$appDomain.':*'])
                ->add(Directive::STYLE, ['https://'.$appDomain.':*', 'sha256-skqujXORqzxt1aE0NNXxujEanPTX6raoqSscTV/Ww/Y='])
                ->add(Directive::FRAME, 'https://'.$appDomain.':*')
                ->add(Directive::SCRIPT, 'https://'.$appDomain.':*');
        }
    }
}
