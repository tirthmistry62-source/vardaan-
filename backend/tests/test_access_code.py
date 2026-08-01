import os

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")

from server import generate_access_code, is_valid_access_code, verify_access_code


def test_generate_access_code_is_six_digits():
    code = generate_access_code()
    assert is_valid_access_code(code)


def test_verify_access_code_matches_linked_parent_codes():
    child = {
        "mother_access_code": "123456",
        "father_access_code": "654321",
    }

    assert verify_access_code(child, "123456")
    assert verify_access_code(child, "654321")
    assert not verify_access_code(child, "000000")
