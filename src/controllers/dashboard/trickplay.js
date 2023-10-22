import 'jquery';
import loading from '../../components/loading/loading';
import libraryMenu from '../../scripts/libraryMenu';
import globalize from '../../scripts/globalize';
import Dashboard from '../../utils/dashboard';

/* eslint-disable indent */

function loadPage(page, config) {
    const trickplayOptions = config.TrickplayOptions;

    page.querySelector('#chkEnableHwAcceleration').checked = trickplayOptions.EnableHwAcceleration;
    $('#selectScanBehavior', page).val(trickplayOptions.ScanBehavior);
    $('#selectProcessPriority', page).val(trickplayOptions.ProcessPriority);
    $('#txtInterval', page).val(trickplayOptions.Interval);
    $('#txtWidthResolutions', page).val(trickplayOptions.WidthResolutions.join(','));
    $('#txtTileWidth', page).val(trickplayOptions.TileWidth);
    $('#txtTileHeight', page).val(trickplayOptions.TileHeight);
    $('#txtQscale', page).val(trickplayOptions.Qscale);
    $('#txtJpegQuality', page).val(trickplayOptions.JpegQuality);
    $('#txtProcessThreads', page).val(trickplayOptions.ProcessThreads);
    loading.hide();
}

function onSubmit() {
    loading.show();
    const form = this;
    ApiClient.getServerConfiguration().then(function (config) {
        const trickplayOptions = config.TrickplayOptions;

        trickplayOptions.EnableHwAcceleration = form.querySelector('#chkEnableHwAcceleration').checked;
        trickplayOptions.ScanBehavior = $('#selectScanBehavior', form).val();
        trickplayOptions.ProcessPriority = $('#selectProcessPriority', form).val();
        trickplayOptions.Interval = Math.max(0, Number.parseInt($('#txtInterval', form).val() || '10000', 10));
        trickplayOptions.WidthResolutions = $('#txtWidthResolutions', form).val().replace(' ', '').split(',').map(Number);
        trickplayOptions.TileWidth = Math.max(1, Number.parseInt($('#txtTileWidth', form).val() || '10', 10));
        trickplayOptions.TileHeight = Math.max(1, Number.parseInt($('#txtTileHeight', form).val() || '10', 10));
        trickplayOptions.Qscale = Math.min(31, Number.parseInt($('#txtQscale', form).val() || '10', 10));
        trickplayOptions.JpegQuality = Math.min(100, Number.parseInt($('#txtJpegQuality', form).val() || '80', 10));
        trickplayOptions.ProcessThreads = Number.parseInt($('#txtProcessThreads', form).val() || '0', 10);

        ApiClient.updateServerConfiguration(config).then(Dashboard.processServerConfigurationUpdateResult);
    });

    return false;
}

function getTabs() {
    return [{
        href: '#/dashboard/playback/transcoding',
        name: globalize.translate('Transcoding')
    }, {
        href: '#/dashboard/playback/trickplay',
        name: globalize.translate('Trickplay')
    }, {
        href: '#/dashboard/playback/resume',
        name: globalize.translate('ButtonResume')
    }, {
        href: '#/dashboard/playback/streaming',
        name: globalize.translate('TabStreaming')
    }];
}

$(document).on('pageinit', '#trickplayConfigurationPage', function () {
    $('.trickplayConfigurationForm').off('submit', onSubmit).on('submit', onSubmit);
}).on('pageshow', '#trickplayConfigurationPage', function () {
    loading.show();
    libraryMenu.setTabs('playback', 1, getTabs);
    const page = this;
    ApiClient.getServerConfiguration().then(function (config) {
        loadPage(page, config);
    });
});

/* eslint-enable indent */
