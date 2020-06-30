<?php 

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class BSF_Analytics_Loader_Astra {

    public function __construct() {

		define( 'BSF_ANALYTICS_PATH', dirname( __FILE__ ) );

        $this->set_version_globals();

        add_action( 'init', array( $this, 'load_analytics' ) );
    }

    public function set_version_globals() {

        $version_file = realpath( ASTRA_THEME_DIR . 'admin/bsf-analytics/version.yml' );

        // Is file 'version.yml' exist?
        if ( is_file( $version_file ) ) {
            global $bsf_analytics_version, $bsf_analytics_path;
            $bsf_analytics_dir = ASTRA_THEME_DIR . 'admin/bsf-analytics/';
            $version      = file_get_contents( $version_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

            // Compare versions.
            if ( version_compare( $version, $bsf_analytics_version, '>' ) ) {
                $bsf_analytics_version = $version;
                $bsf_analytics_path    = $bsf_analytics_dir;
            }
        }
    }

    public function load_analytics() {
        global $bsf_analytics_path;

        require_once $bsf_analytics_path . 'class-bsf-analytics.php';

        $bsf_analytics  = new BSF_Analytics();
        $bsf_analytics->set_product_name( 'Astra' );

    }
}

new BSF_Analytics_Loader_Astra();