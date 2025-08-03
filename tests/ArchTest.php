<?php

declare(strict_types=1);

test('application can boot')
    ->expect(true)
    ->toBeTrue();

test('models have proper documentation')
    ->expect('App\\Models')
    ->toHavePropertiesDocumented();

test('controllers do not have debugging statements')
    ->expect(['dd', 'dump', 'ray', 'var_dump'])
    ->not->toBeUsed();