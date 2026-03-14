def trimester_for_week(pregnancy_week: int) -> int:
    if pregnancy_week <= 13:
        return 1
    if pregnancy_week <= 27:
        return 2
    return 3
