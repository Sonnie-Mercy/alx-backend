#!/usr/bin/env python3
""" 0-simple_helper_function.py """


def index_range(page: int, page_size: int) -> tuple:
    """
    function named index_range that takes two integer arguments
    page and page_size
    """
    start = (page - 1) * page_size
    end = page * page_size
    return (start, end)
