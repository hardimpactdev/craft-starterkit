<?php

namespace App\Support\Csp\Presets;

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;
use Spatie\Csp\Policy;
use Spatie\Csp\Preset;

class Development implements Preset
{
    public function configure(Policy $policy): void
    {
        if (app()->environment('production')) {
            return;
        }

        /** @var string $appUrl */
        $appUrl = config('app.url');

        $appDomain = explode('://', $appUrl)[1];

        $policy
            ->add(Directive::CONNECT, ['wss://localhost:*', 'wss://'.$appDomain.':*', 'https://'.$appDomain.':*', 'ws://laravel-toolbar.test:*', 'wss://laravel-toolbar.test:*', 'http://laravel-toolbar.test:*', 'https://toolbar.test:*'])
            ->add(Directive::STYLE, [
                'https://'.$appDomain.':*',
                Keyword::UNSAFE_INLINE,
            ])
            ->add(Directive::FRAME, 'https://'.$appDomain.':*')
            ->add(Directive::SCRIPT, [
                'https://'.$appDomain.':*',
                'http://'.$appDomain.':*',
                'http://laravel-toolbar.test:*',
                Keyword::UNSAFE_INLINE,
            ])
            ->add(Directive::FONT, ['https://'.$appDomain.':*', 'https://laravel-toolbar.test:*'])
            ->add(Directive::IMG, ['https://'.$appDomain.':*', 'data:']);
    }
}
