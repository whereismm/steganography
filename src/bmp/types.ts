/**
 * Bmp File Header structure
 */
type BmpFileHeader = {
    magic: Uint8Array,
    size_in_bytes: Uint8Array,
    app_data: Uint8Array,
    data_offset: Uint8Array
}

/**
 * Bmp File information structure
 */
type BmpFileInfo = {
    hd_size: Uint8Array,
    weidth: Uint8Array,
    heigth: Uint8Array,
    color_planes: Uint8Array,
    bits_per_pixel: Uint8Array,
    compression: Uint8Array,
    bits_size: Uint8Array,
    horizontal_resolution: Uint8Array,
    vertical_resolution: Uint8Array,
    number_colours: Uint8Array,
    important_colors: Uint8Array
}

export {BmpFileHeader, BmpFileInfo};