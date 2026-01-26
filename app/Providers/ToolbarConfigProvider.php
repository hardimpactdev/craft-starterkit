<?php

namespace App\Providers;

use NckRtl\Toolbar\Collectors\QueriesCollector;
use NckRtl\Toolbar\Data\Configurations\QueriesConfig;
use NckRtl\Toolbar\Data\Layout\GroupConfig;
use NckRtl\Toolbar\Data\Layout\LayoutConfig;
use NckRtl\Toolbar\Data\ToolbarConfig;
use NckRtl\Toolbar\Data\Tools\VueDevtoolsTool;
use NckRtl\Toolbar\Data\Tools\VueInspectorTool;
use NckRtl\Toolbar\Enums\Layout\Section;
use NckRtl\Toolbar\Providers\ToolbarProvider;

class ToolbarConfigProvider extends ToolbarProvider
{
    public function update(ToolbarConfig $toolbarConfig): void
    {

        $toolbarConfig->debug()
            ->updateCollectorConfig(QueriesCollector::class, new QueriesConfig(
                showSessionQueries: false,
            ))
            ->layout(function (LayoutConfig $layoutConfig): void {
                $layoutConfig->addGroup(
                    groupConfig: new GroupConfig()->setTools(
                        new VueDevtoolsTool,
                        new VueInspectorTool,
                    )->section(Section::CENTER), prepend: true
                );
            });
    }
}
