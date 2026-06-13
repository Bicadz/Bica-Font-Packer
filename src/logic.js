/**
 * Pure logic functions extracted from index.html for testability.
 * These functions contain the core computation and data transformation
 * logic of the Bica Font Packer, free of DOM dependencies.
 */

const chuoi_base = "abcdefghijklmnopqrstuvwxyz!#$%\"&'()*+,-./0123456789:;<=>?@[\\]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const bo_loc_ten_sheep = {
    "/": "slash", "\\": "backslash", ":": "colon", "*": "asterisk", "?": "question",
    '"': "quote", "<": "less_than", ">": "greater_than", "|": "pipe", " ": "space",
    "\n": "newline", "\r": "carriage_return", "\t": "tab", ".": "dot"
};

const kho_ngon_ngu_mau = {
    latin:          chuoi_base,
    vietnamese:     chuoi_base + "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ",
    spanish:        chuoi_base + "áéíóúüñÁÉÍÓÚÜÑ¿¡",
    german:         chuoi_base + "äöüßÄÖÜẞé",
    russian:        chuoi_base + "абвгдеёжзийклмнопрствуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
    greek:          chuoi_base + "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚλμνξοπρστυφχψωάέήίόύώϊϋΐΰΆΈΉΊΌΎΏ",
    french:         chuoi_base + "éèàùçâêîôûëïüÿÀÉÈÇÂÊÎÔÛËÏÜŸæœÆŒ",
    portuguese:     chuoi_base + "áâãàçéêíóôõúÁÂÃÀÇÉÊÍÓÔÕÚ",
    turkish:        chuoi_base + "çğıİöşüÇĞÖŞÜ",
    polish:         chuoi_base + "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ",
    czech:          chuoi_base + "áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ",
    swedish:        chuoi_base + "åäöÅÄÖ",
    nordic:         chuoi_base + "åæøÅÆØ",
    romanian:       chuoi_base + "ăâîșțĂÂÎȘȚ",
    hungarian:      chuoi_base + "áéíóöőúüűÁÉÍÓÖŐÚÜŰ",
    serbocroatian:  chuoi_base + "čćđšžČĆĐŠŽ",
    ukrainian:      chuoi_base + "абвгдеёжзийклмнопрствуфхцчшщъыьэюяґєіїАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯҐЄІЇ",
};

function lay_ten_font_an_toan(font_obj) {
    const ten_goc = font_obj.names?.fontFamily?.en || Object.values(font_obj.names?.fontFamily || {})[0] || "UnknownFont";
    const kieu_goc = font_obj.names?.fontSubfamily?.en || Object.values(font_obj.names?.fontSubfamily || {})[0] || "Regular";
    return `${ten_goc} - ${kieu_goc}`;
}

function mien_cau_truc_goc() {
    return {
        "isStage": false,
        "name": "Font",
        "variables": {},
        "lists": {},
        "broadcasts": {},
        "blocks": {},
        "comments": {},
        "currentCostume": 0,
        "costumes": [],
        "sounds": [],
        "volume": 100,
        "visible": true,
        "x": 0,
        "y": 0,
        "size": 100,
        "direction": 90,
        "draggable": false,
        "rotationStyle": "all around",
        "layerOrder": 0,
        "tempo": 60,
        "videoTransparency": 50,
        "videoState": "on",
        "textToSpeechLanguage": null
    };
}

function loc_ky_tu_duy_nhat(van_ban) {
    const chuoi_sach = van_ban.replace(/[\r\n\t]/g, '');
    const mang_duy_nhat = [...new Set(chuoi_sach.split(''))];
    return mang_duy_nhat.join('');
}

function tinh_toan_du_lieu_glyph(glyph, font, cau_hinh) {
    const { size_chu, do_day_vien, ti_le_width, loai_can_tam, mau_chu, mau_vien } = cau_hinh;

    const ti_le_scale = size_chu / font.unitsPerEm;
    const phan_dem_vien = do_day_vien;
    const co_vien = mau_vien && mau_vien.toLowerCase() !== 'none';

    const ascender_thuc = font.ascender * ti_le_scale;
    const descender_thuc = font.descender * ti_le_scale;
    const chieu_cao_an_toan = (ascender_thuc - descender_thuc) + phan_dem_vien;

    const do_rong_goc = glyph.advanceWidth !== undefined ? glyph.advanceWidth : font.unitsPerEm;
    let do_rong_ngang_thuc = do_rong_goc * ti_le_scale * ti_le_width;
    if (do_rong_ngang_thuc <= 0) { do_rong_ngang_thuc = size_chu * 0.25; }

    const do_rong_khung = do_rong_ngang_thuc + phan_dem_vien;
    const ly_tuong_y = ascender_thuc + (phan_dem_vien / 2);

    const path = glyph.getPath(0, 0, size_chu);
    let svgPathData = path.toPathData(2);

    if (svgPathData && ti_le_width !== 1) {
        svgPathData = svgPathData.replace(/([MLCQZSHVAG])([^MLCQZSHVAG]*)/gi, (match, command, args) => {
            if (!args.trim()) return match;
            let coords = args.trim().match(/-?\d*\.?\d+/g) || [];
            if (command.toUpperCase() === 'V') return match;
            if (command.toUpperCase() === 'H') {
                return command + coords.map(x => Math.round(parseFloat(x) * ti_le_width)).join(' ');
            }
            for (let k = 0; k < coords.length; k += 2) {
                if (coords[k]) coords[k] = Math.round(parseFloat(coords[k]) * ti_le_width);
                if (coords[k + 1]) coords[k + 1] = Math.round(parseFloat(coords[k + 1]));
            }
            return command + coords.join(' ');
        });
    }

    let strokeWidth = co_vien ? do_day_vien : 0;
    const maxStrokeWidth = size_chu * 0.1367;
    if (strokeWidth > maxStrokeWidth) { strokeWidth = maxStrokeWidth; }

    let logic_net_chu = '';
    let svgSize = 0;
    if (svgPathData) {
        if (co_vien && strokeWidth > 0) {
            logic_net_chu += `<path d="${svgPathData}" fill="${mau_chu}" stroke="${mau_vien}" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;
        } else {
            logic_net_chu += `<path d="${svgPathData}" fill="${mau_chu}" />`;
        }
        svgSize = logic_net_chu.length;
    }

    let tam_x = do_rong_khung / 2;
    let tam_y = chieu_cao_an_toan / 2;
    let dich_x_g = phan_dem_vien / 2;
    let dich_y_g = 0;

    const bbox = glyph.getBoundingBox();

    const tam_chu_x = (((bbox.x1 || 0) + (bbox.x2 || 0)) / 2) * ti_le_scale * ti_le_width;
    const tam_chu_y = (((bbox.y1 || 0) + (bbox.y2 || 0)) / 2) * ti_le_scale;

    if (loai_can_tam === 'baseline') {
        dich_y_g = ly_tuong_y;
        tam_y = ly_tuong_y;
    } else if (loai_can_tam === 'center') {
        dich_y_g = ly_tuong_y;
        const glyph_center_x = dich_x_g + tam_chu_x;
        const box_center_x = do_rong_khung / 2;
        tam_x = (glyph_center_x * 0.25) + (box_center_x * 0.75);
        tam_y = ly_tuong_y;
    } else if (loai_can_tam === 'box') {
        dich_x_g = tam_x - tam_chu_x;
        dich_y_g = tam_y + tam_chu_y;
    }
    return { do_rong_khung, chieu_cao_an_toan, tam_x, tam_y, dich_x_g, dich_y_g, logic_net_chu, svgSize, valid: !!svgPathData };
}

function tinh_do_rong_ngang(glyph, font, size_chu, ti_le_width, do_day_vien) {
    const ti_le_scale = size_chu / font.unitsPerEm;
    const phan_dem_vien = do_day_vien;
    const do_rong_goc = glyph.advanceWidth !== undefined ? glyph.advanceWidth : font.unitsPerEm;
    return (do_rong_goc * ti_le_scale * ti_le_width) + phan_dem_vien;
}

function tao_ten_tep_hop_le(ky_tu) {
    return (bo_loc_ten_sheep[ky_tu] || ky_tu).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
}

function phan_loai_thu_muc(ky_tu) {
    if (ky_tu !== ky_tu.toUpperCase() && ky_tu === ky_tu.toLowerCase()) return "lowercase";
    if (ky_tu !== ky_tu.toLowerCase() && ky_tu === ky_tu.toUpperCase()) return "uppercase";
    return "others";
}

function kiem_tra_ho_tro_ngon_ngu(fontChars, langChars) {
    let supportedCount = 0;
    for (const char of langChars) {
        if (fontChars.has(char)) {
            supportedCount++;
        }
    }
    return supportedCount / langChars.length;
}

function tinh_toi_gian_cjk(loai, chuoi_preset, chuoi_base_len) {
    const cjk_languages = ['chinese', 'korean', 'japanese'];
    if (cjk_languages.includes(loai)) {
        return chuoi_preset.substring(0, 4000 + chuoi_base_len);
    }
    return chuoi_preset;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function parse_cau_hinh(raw) {
    return {
        size_chu: clamp(parseInt(raw.size_chu) || 64, 4, 512),
        mau_chu: raw.mau_chu || '#ffffff',
        mau_vien: raw.co_vien ? (raw.mau_vien || 'none') : 'none',
        do_day_vien: clamp(parseFloat(raw.do_day_vien) || 0, 0, 100),
        ti_le_width: clamp(parseFloat(raw.ti_le_width) || 100, 30, 300) / 100,
        loai_can_tam: raw.loai_can_tam || 'baseline'
    };
}

export {
    chuoi_base,
    bo_loc_ten_sheep,
    kho_ngon_ngu_mau,
    lay_ten_font_an_toan,
    mien_cau_truc_goc,
    loc_ky_tu_duy_nhat,
    tinh_toan_du_lieu_glyph,
    tinh_do_rong_ngang,
    tao_ten_tep_hop_le,
    phan_loai_thu_muc,
    kiem_tra_ho_tro_ngon_ngu,
    tinh_toi_gian_cjk,
    clamp,
    parse_cau_hinh,
};
