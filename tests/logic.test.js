import { describe, it, expect } from 'vitest';
import {
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
} from '../src/logic.js';

// ──────────────────────────────────────────────────
// chuoi_base
// ──────────────────────────────────────────────────
describe('chuoi_base', () => {
    it('contains lowercase a-z', () => {
        for (let i = 97; i <= 122; i++) {
            expect(chuoi_base).toContain(String.fromCharCode(i));
        }
    });

    it('contains uppercase A-Z', () => {
        for (let i = 65; i <= 90; i++) {
            expect(chuoi_base).toContain(String.fromCharCode(i));
        }
    });

    it('contains digits 0-9', () => {
        for (let i = 48; i <= 57; i++) {
            expect(chuoi_base).toContain(String.fromCharCode(i));
        }
    });

    it('contains common punctuation', () => {
        for (const ch of '!#$%&()*+,-./:;<=>?@^_`{|}~') {
            expect(chuoi_base).toContain(ch);
        }
    });
});

// ──────────────────────────────────────────────────
// bo_loc_ten_sheep
// ──────────────────────────────────────────────────
describe('bo_loc_ten_sheep', () => {
    it('maps / to "slash"', () => {
        expect(bo_loc_ten_sheep['/']).toBe('slash');
    });

    it('maps \\ to "backslash"', () => {
        expect(bo_loc_ten_sheep['\\']).toBe('backslash');
    });

    it('maps space to "space"', () => {
        expect(bo_loc_ten_sheep[' ']).toBe('space');
    });

    it('maps newline to "newline"', () => {
        expect(bo_loc_ten_sheep['\n']).toBe('newline');
    });

    it('maps tab to "tab"', () => {
        expect(bo_loc_ten_sheep['\t']).toBe('tab');
    });

    it('maps . to "dot"', () => {
        expect(bo_loc_ten_sheep['.']).toBe('dot');
    });

    it('maps all 14 special characters', () => {
        expect(Object.keys(bo_loc_ten_sheep)).toHaveLength(14);
    });
});

// ──────────────────────────────────────────────────
// kho_ngon_ngu_mau
// ──────────────────────────────────────────────────
describe('kho_ngon_ngu_mau', () => {
    it('latin preset equals chuoi_base', () => {
        expect(kho_ngon_ngu_mau.latin).toBe(chuoi_base);
    });

    it('vietnamese preset starts with chuoi_base', () => {
        expect(kho_ngon_ngu_mau.vietnamese.startsWith(chuoi_base)).toBe(true);
    });

    it('vietnamese includes Vietnamese diacritical chars', () => {
        for (const ch of 'àáạảãâđĐ') {
            expect(kho_ngon_ngu_mau.vietnamese).toContain(ch);
        }
    });

    it('russian includes Cyrillic characters', () => {
        for (const ch of 'абвгдАБВГД') {
            expect(kho_ngon_ngu_mau.russian).toContain(ch);
        }
    });

    it('all language presets contain base Latin characters', () => {
        for (const [lang, chars] of Object.entries(kho_ngon_ngu_mau)) {
            expect(chars).toContain('a');
            expect(chars).toContain('Z');
            expect(chars).toContain('0');
        }
    });

    it('spanish includes ñ and ¿', () => {
        expect(kho_ngon_ngu_mau.spanish).toContain('ñ');
        expect(kho_ngon_ngu_mau.spanish).toContain('¿');
    });

    it('german includes ß and ä', () => {
        expect(kho_ngon_ngu_mau.german).toContain('ß');
        expect(kho_ngon_ngu_mau.german).toContain('ä');
    });
});

// ──────────────────────────────────────────────────
// lay_ten_font_an_toan
// ──────────────────────────────────────────────────
describe('lay_ten_font_an_toan', () => {
    it('returns "Family - Subfamily" for a normal font object', () => {
        const font = {
            names: {
                fontFamily: { en: 'Roboto' },
                fontSubfamily: { en: 'Bold' },
            },
        };
        expect(lay_ten_font_an_toan(font)).toBe('Roboto - Bold');
    });

    it('falls back to first value if "en" key missing', () => {
        const font = {
            names: {
                fontFamily: { vi: 'MyFont' },
                fontSubfamily: { vi: 'Italic' },
            },
        };
        expect(lay_ten_font_an_toan(font)).toBe('MyFont - Italic');
    });

    it('uses "UnknownFont" when fontFamily is empty', () => {
        const font = { names: { fontFamily: {}, fontSubfamily: { en: 'Regular' } } };
        expect(lay_ten_font_an_toan(font)).toBe('UnknownFont - Regular');
    });

    it('uses "Regular" when fontSubfamily is empty', () => {
        const font = { names: { fontFamily: { en: 'Arial' }, fontSubfamily: {} } };
        expect(lay_ten_font_an_toan(font)).toBe('Arial - Regular');
    });

    it('uses both defaults when names are empty', () => {
        const font = { names: {} };
        expect(lay_ten_font_an_toan(font)).toBe('UnknownFont - Regular');
    });
});

// ──────────────────────────────────────────────────
// mien_cau_truc_goc
// ──────────────────────────────────────────────────
describe('mien_cau_truc_goc', () => {
    it('returns a sprite structure with correct default fields', () => {
        const result = mien_cau_truc_goc();
        expect(result.isStage).toBe(false);
        expect(result.name).toBe('Font');
        expect(result.costumes).toEqual([]);
        expect(result.sounds).toEqual([]);
        expect(result.volume).toBe(100);
        expect(result.visible).toBe(true);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.size).toBe(100);
        expect(result.direction).toBe(90);
        expect(result.draggable).toBe(false);
        expect(result.rotationStyle).toBe('all around');
    });

    it('returns a new object each call (no shared reference)', () => {
        const a = mien_cau_truc_goc();
        const b = mien_cau_truc_goc();
        expect(a).not.toBe(b);
        expect(a).toEqual(b);
    });

    it('has empty objects for variables, lists, blocks, etc.', () => {
        const result = mien_cau_truc_goc();
        expect(result.variables).toEqual({});
        expect(result.lists).toEqual({});
        expect(result.broadcasts).toEqual({});
        expect(result.blocks).toEqual({});
        expect(result.comments).toEqual({});
    });
});

// ──────────────────────────────────────────────────
// loc_ky_tu_duy_nhat
// ──────────────────────────────────────────────────
describe('loc_ky_tu_duy_nhat', () => {
    it('returns unique characters from input', () => {
        expect(loc_ky_tu_duy_nhat('aabbcc')).toBe('abc');
    });

    it('strips newlines, carriage returns, and tabs', () => {
        expect(loc_ky_tu_duy_nhat("a\nb\rc\td")).toBe('abcd');
    });

    it('preserves order of first occurrence', () => {
        expect(loc_ky_tu_duy_nhat('banana')).toBe('ban');
    });

    it('handles empty string', () => {
        expect(loc_ky_tu_duy_nhat('')).toBe('');
    });

    it('handles Unicode characters', () => {
        expect(loc_ky_tu_duy_nhat('aaàáạ')).toBe('aàáạ');
    });

    it('handles string with only whitespace characters', () => {
        expect(loc_ky_tu_duy_nhat('\n\r\t')).toBe('');
    });

    it('handles mixed text and whitespace', () => {
        expect(loc_ky_tu_duy_nhat('hello\nworld\t!')).toBe('helowrd!');
    });
});

// ──────────────────────────────────────────────────
// tao_ten_tep_hop_le
// ──────────────────────────────────────────────────
describe('tao_ten_tep_hop_le', () => {
    it('maps special characters via bo_loc_ten_sheep', () => {
        expect(tao_ten_tep_hop_le('/')).toBe('slash');
        expect(tao_ten_tep_hop_le('\\')).toBe('backslash');
        expect(tao_ten_tep_hop_le(':')).toBe('colon');
        expect(tao_ten_tep_hop_le('*')).toBe('asterisk');
        expect(tao_ten_tep_hop_le('?')).toBe('question');
        expect(tao_ten_tep_hop_le('"')).toBe('quote');
        expect(tao_ten_tep_hop_le('<')).toBe('less_than');
        expect(tao_ten_tep_hop_le('>')).toBe('greater_than');
        expect(tao_ten_tep_hop_le('|')).toBe('pipe');
        expect(tao_ten_tep_hop_le(' ')).toBe('space');
    });

    it('returns the character itself for normal chars', () => {
        expect(tao_ten_tep_hop_le('a')).toBe('a');
        expect(tao_ten_tep_hop_le('Z')).toBe('Z');
        expect(tao_ten_tep_hop_le('5')).toBe('5');
    });

    it('replaces control characters with underscore', () => {
        expect(tao_ten_tep_hop_le('\x00')).toBe('_');
        expect(tao_ten_tep_hop_le('\x1F')).toBe('_');
    });
});

// ──────────────────────────────────────────────────
// phan_loai_thu_muc
// ──────────────────────────────────────────────────
describe('phan_loai_thu_muc', () => {
    it('classifies lowercase letters as "lowercase"', () => {
        expect(phan_loai_thu_muc('a')).toBe('lowercase');
        expect(phan_loai_thu_muc('z')).toBe('lowercase');
        expect(phan_loai_thu_muc('m')).toBe('lowercase');
    });

    it('classifies uppercase letters as "uppercase"', () => {
        expect(phan_loai_thu_muc('A')).toBe('uppercase');
        expect(phan_loai_thu_muc('Z')).toBe('uppercase');
        expect(phan_loai_thu_muc('M')).toBe('uppercase');
    });

    it('classifies digits as "others"', () => {
        expect(phan_loai_thu_muc('0')).toBe('others');
        expect(phan_loai_thu_muc('9')).toBe('others');
    });

    it('classifies punctuation as "others"', () => {
        expect(phan_loai_thu_muc('!')).toBe('others');
        expect(phan_loai_thu_muc('@')).toBe('others');
        expect(phan_loai_thu_muc('.')).toBe('others');
    });

    it('classifies Vietnamese lowercase as "lowercase"', () => {
        expect(phan_loai_thu_muc('à')).toBe('lowercase');
        expect(phan_loai_thu_muc('đ')).toBe('lowercase');
    });

    it('classifies Vietnamese uppercase as "uppercase"', () => {
        expect(phan_loai_thu_muc('À')).toBe('uppercase');
        expect(phan_loai_thu_muc('Đ')).toBe('uppercase');
    });
});

// ──────────────────────────────────────────────────
// kiem_tra_ho_tro_ngon_ngu
// ──────────────────────────────────────────────────
describe('kiem_tra_ho_tro_ngon_ngu', () => {
    it('returns 1.0 when all characters are supported', () => {
        const fontChars = new Set(['a', 'b', 'c']);
        expect(kiem_tra_ho_tro_ngon_ngu(fontChars, 'abc')).toBe(1.0);
    });

    it('returns 0.0 when no characters are supported', () => {
        const fontChars = new Set(['x', 'y', 'z']);
        expect(kiem_tra_ho_tro_ngon_ngu(fontChars, 'abc')).toBe(0.0);
    });

    it('returns correct ratio for partial support', () => {
        const fontChars = new Set(['a', 'b']);
        expect(kiem_tra_ho_tro_ngon_ngu(fontChars, 'abcd')).toBe(0.5);
    });

    it('returns correct ratio with one char supported', () => {
        const fontChars = new Set(['a']);
        expect(kiem_tra_ho_tro_ngon_ngu(fontChars, 'abcde')).toBeCloseTo(0.2);
    });
});

// ──────────────────────────────────────────────────
// tinh_toi_gian_cjk
// ──────────────────────────────────────────────────
describe('tinh_toi_gian_cjk', () => {
    const base_len = chuoi_base.length;

    it('truncates chinese to 4000 + base_len', () => {
        const longStr = 'x'.repeat(25000);
        const result = tinh_toi_gian_cjk('chinese', longStr, base_len);
        expect(result.length).toBe(4000 + base_len);
    });

    it('truncates korean to 4000 + base_len', () => {
        const longStr = 'x'.repeat(15000);
        const result = tinh_toi_gian_cjk('korean', longStr, base_len);
        expect(result.length).toBe(4000 + base_len);
    });

    it('truncates japanese to 4000 + base_len', () => {
        const longStr = 'x'.repeat(10000);
        const result = tinh_toi_gian_cjk('japanese', longStr, base_len);
        expect(result.length).toBe(4000 + base_len);
    });

    it('does not truncate non-CJK languages', () => {
        const str = 'x'.repeat(5000);
        expect(tinh_toi_gian_cjk('latin', str, base_len)).toBe(str);
        expect(tinh_toi_gian_cjk('vietnamese', str, base_len)).toBe(str);
    });

    it('does not truncate if string is shorter than limit', () => {
        const shortStr = 'hello';
        expect(tinh_toi_gian_cjk('chinese', shortStr, base_len)).toBe(shortStr);
    });
});

// ──────────────────────────────────────────────────
// clamp
// ──────────────────────────────────────────────────
describe('clamp', () => {
    it('returns value when within range', () => {
        expect(clamp(50, 0, 100)).toBe(50);
    });

    it('clamps to min when below', () => {
        expect(clamp(-5, 0, 100)).toBe(0);
    });

    it('clamps to max when above', () => {
        expect(clamp(150, 0, 100)).toBe(100);
    });

    it('returns min when value equals min', () => {
        expect(clamp(0, 0, 100)).toBe(0);
    });

    it('returns max when value equals max', () => {
        expect(clamp(100, 0, 100)).toBe(100);
    });
});

// ──────────────────────────────────────────────────
// parse_cau_hinh
// ──────────────────────────────────────────────────
describe('parse_cau_hinh', () => {
    it('parses valid configuration', () => {
        const result = parse_cau_hinh({
            size_chu: '64',
            mau_chu: '#ff0000',
            co_vien: true,
            mau_vien: '#00ff00',
            do_day_vien: '3',
            ti_le_width: '150',
            loai_can_tam: 'center',
        });
        expect(result.size_chu).toBe(64);
        expect(result.mau_chu).toBe('#ff0000');
        expect(result.mau_vien).toBe('#00ff00');
        expect(result.do_day_vien).toBe(3);
        expect(result.ti_le_width).toBe(1.5);
        expect(result.loai_can_tam).toBe('center');
    });

    it('clamps size_chu to 4-512', () => {
        expect(parse_cau_hinh({ size_chu: '1' }).size_chu).toBe(4);
        expect(parse_cau_hinh({ size_chu: '1000' }).size_chu).toBe(512);
    });

    it('clamps do_day_vien to 0-100', () => {
        expect(parse_cau_hinh({ do_day_vien: '-5' }).do_day_vien).toBe(0);
        expect(parse_cau_hinh({ do_day_vien: '200' }).do_day_vien).toBe(100);
    });

    it('clamps ti_le_width to 30-300 then divides by 100', () => {
        expect(parse_cau_hinh({ ti_le_width: '10' }).ti_le_width).toBe(0.3);
        expect(parse_cau_hinh({ ti_le_width: '500' }).ti_le_width).toBe(3.0);
    });

    it('sets mau_vien to "none" when co_vien is false', () => {
        const result = parse_cau_hinh({ co_vien: false, mau_vien: '#ff0000' });
        expect(result.mau_vien).toBe('none');
    });

    it('defaults to baseline alignment', () => {
        expect(parse_cau_hinh({}).loai_can_tam).toBe('baseline');
    });

    it('defaults mau_chu to #ffffff when missing', () => {
        expect(parse_cau_hinh({}).mau_chu).toBe('#ffffff');
    });

    it('uses default size when NaN', () => {
        expect(parse_cau_hinh({ size_chu: 'abc' }).size_chu).toBe(64);
    });
});

// ──────────────────────────────────────────────────
// tinh_toan_du_lieu_glyph
// ──────────────────────────────────────────────────
describe('tinh_toan_du_lieu_glyph', () => {
    function makeMockGlyph(advanceWidth = 500, pathData = 'M0 0L100 100Z', bbox = { x1: 0, y1: 0, x2: 100, y2: 100 }) {
        return {
            advanceWidth,
            getPath: () => ({
                toPathData: () => pathData,
            }),
            getBoundingBox: () => bbox,
        };
    }

    function makeMockFont(unitsPerEm = 1000, ascender = 800, descender = -200) {
        return { unitsPerEm, ascender, descender };
    }

    const baseCauHinh = {
        size_chu: 64,
        do_day_vien: 0,
        ti_le_width: 1,
        loai_can_tam: 'baseline',
        mau_chu: '#ffffff',
        mau_vien: 'none',
    };

    it('computes basic glyph data with baseline alignment', () => {
        const glyph = makeMockGlyph();
        const font = makeMockFont();
        const result = tinh_toan_du_lieu_glyph(glyph, font, baseCauHinh);

        expect(result.valid).toBe(true);
        expect(result.do_rong_khung).toBeCloseTo(32); // 500 * (64/1000) * 1 + 0
        expect(result.chieu_cao_an_toan).toBeCloseTo(64); // (800*0.064 - (-200)*0.064) + 0
        expect(result.svgSize).toBeGreaterThan(0);
        expect(result.logic_net_chu).toContain('fill="#ffffff"');
        expect(result.logic_net_chu).not.toContain('stroke');
    });

    it('handles stroke when mau_vien is set', () => {
        const glyph = makeMockGlyph();
        const font = makeMockFont();
        const cauHinh = { ...baseCauHinh, mau_vien: '#ff0000', do_day_vien: 2 };
        const result = tinh_toan_du_lieu_glyph(glyph, font, cauHinh);

        expect(result.logic_net_chu).toContain('stroke="#ff0000"');
        expect(result.logic_net_chu).toContain('stroke-width="2"');
        expect(result.do_rong_khung).toBeCloseTo(34); // 32 + 2 (vien)
    });

    it('caps strokeWidth at size_chu * 0.1367', () => {
        const glyph = makeMockGlyph();
        const font = makeMockFont();
        const cauHinh = { ...baseCauHinh, mau_vien: '#ff0000', do_day_vien: 50 };
        const result = tinh_toan_du_lieu_glyph(glyph, font, cauHinh);

        const maxStroke = 64 * 0.1367;
        expect(result.logic_net_chu).toContain(`stroke-width="${maxStroke}"`);
    });

    it('uses center alignment mode', () => {
        const glyph = makeMockGlyph();
        const font = makeMockFont();
        const cauHinh = { ...baseCauHinh, loai_can_tam: 'center' };
        const result = tinh_toan_du_lieu_glyph(glyph, font, cauHinh);

        // In center mode, tam_y should equal ly_tuong_y
        const ti_le_scale = 64 / 1000;
        const ly_tuong_y = font.ascender * ti_le_scale + 0;
        expect(result.tam_y).toBeCloseTo(ly_tuong_y);
    });

    it('uses box alignment mode', () => {
        const glyph = makeMockGlyph();
        const font = makeMockFont();
        const cauHinh = { ...baseCauHinh, loai_can_tam: 'box' };
        const result = tinh_toan_du_lieu_glyph(glyph, font, cauHinh);

        expect(result.tam_x).toBeCloseTo(result.do_rong_khung / 2);
        expect(result.tam_y).toBeCloseTo(result.chieu_cao_an_toan / 2);
    });

    it('returns valid=false when path data is empty', () => {
        const glyph = makeMockGlyph(500, '', { x1: 0, y1: 0, x2: 0, y2: 0 });
        const font = makeMockFont();
        const result = tinh_toan_du_lieu_glyph(glyph, font, baseCauHinh);

        expect(result.valid).toBe(false);
        expect(result.svgSize).toBe(0);
        expect(result.logic_net_chu).toBe('');
    });

    it('falls back to unitsPerEm when advanceWidth is undefined', () => {
        const glyph = {
            getPath: () => ({ toPathData: () => 'M0 0L10 10Z' }),
            getBoundingBox: () => ({ x1: 0, y1: 0, x2: 100, y2: 100 }),
        };
        const font = makeMockFont();
        const result = tinh_toan_du_lieu_glyph(glyph, font, baseCauHinh);

        // Width should be unitsPerEm * scale = 1000 * (64/1000) = 64
        expect(result.do_rong_khung).toBeCloseTo(64);
    });

    it('uses minimum width when advanceWidth is 0', () => {
        const glyph = makeMockGlyph(0, 'M0 0L10 10Z');
        const font = makeMockFont();
        const result = tinh_toan_du_lieu_glyph(glyph, font, baseCauHinh);

        // 0 * scale = 0, so fallback: size_chu * 0.25 = 16
        expect(result.do_rong_khung).toBeCloseTo(16);
    });

    it('applies width scaling', () => {
        const glyph = makeMockGlyph(500, 'M0 0L100 100Z');
        const font = makeMockFont();
        const cauHinh = { ...baseCauHinh, ti_le_width: 2 };
        const result = tinh_toan_du_lieu_glyph(glyph, font, cauHinh);

        // Width with 2x scale: 500 * (64/1000) * 2 = 64
        expect(result.do_rong_khung).toBeCloseTo(64);
    });
});

// ──────────────────────────────────────────────────
// tinh_do_rong_ngang
// ──────────────────────────────────────────────────
describe('tinh_do_rong_ngang', () => {
    const mockFont = { unitsPerEm: 1000 };

    it('calculates width correctly for a standard glyph', () => {
        const glyph = { advanceWidth: 500 };
        // 500 * (64/1000) * 1 + 0 = 32
        expect(tinh_do_rong_ngang(glyph, mockFont, 64, 1, 0)).toBeCloseTo(32);
    });

    it('adds border padding to width', () => {
        const glyph = { advanceWidth: 500 };
        // 500 * (64/1000) * 1 + 4 = 36
        expect(tinh_do_rong_ngang(glyph, mockFont, 64, 1, 4)).toBeCloseTo(36);
    });

    it('applies width scale factor', () => {
        const glyph = { advanceWidth: 500 };
        // 500 * (64/1000) * 1.5 + 0 = 48
        expect(tinh_do_rong_ngang(glyph, mockFont, 64, 1.5, 0)).toBeCloseTo(48);
    });

    it('falls back to unitsPerEm when advanceWidth is undefined', () => {
        const glyph = {};
        // 1000 * (64/1000) * 1 + 0 = 64
        expect(tinh_do_rong_ngang(glyph, mockFont, 64, 1, 0)).toBeCloseTo(64);
    });

    it('handles different font sizes', () => {
        const glyph = { advanceWidth: 1000 };
        // 1000 * (128/1000) * 1 + 0 = 128
        expect(tinh_do_rong_ngang(glyph, mockFont, 128, 1, 0)).toBeCloseTo(128);
    });
});
