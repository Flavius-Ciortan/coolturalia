<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Displays content
 *
 * @param array $atts Shortcode attributes.
 *
 * @return string The custom text.
 */
function customoa_shortcode( $atts ) {
    $options = get_option( 'customoa_text' ); // Use the correct option key name

    if (  ! empty( $options ) ) {
        return $options;
    }

    return '';
}


/**
 * Initializes the frontend.
 */
function customoa_frontend_init() {
    // Register the CustomOA shortcode
    add_shortcode( 'customoa', 'customoa_shortcode' );
}
add_action( 'init', 'customoa_frontend_init' );