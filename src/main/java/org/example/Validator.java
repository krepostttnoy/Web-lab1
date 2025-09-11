package org.example;

import java.util.Map;

public class Validator {
    public static void validate(Map<String, String> params) {
        var x = params.get("x");
        if (x == null || x.isEmpty()) {
            throw new ValidationException("x is invalid");
        }

        var y = params.get("y");
        if (y == null || y.isEmpty()) {
            throw new ValidationException("y is invalid");
        }

        var r = params.get("r");
        if (r == null || r.isEmpty()) {
            throw new ValidationException("r is invalid");
        }

        try {
            var X = Integer.parseInt(x);
            if (X < -5 || X > 3) {
                throw new ValidationException("X has forbidden value");
            }
        } catch (NumberFormatException e) {
            throw new ValidationException("X is not a number");
        }

        try {
            var Y = Integer.parseInt(y);
            if (Y < -5 || Y > 3) {
                throw new ValidationException("Y has forbidden value");
            }
        } catch (NumberFormatException e) {
            throw new ValidationException("Y is not a number");
        }

        try {
            var R = Integer.parseInt(r);
            if (R < 1 || R > 5) {
                throw new ValidationException("R has forbidden value");
            }
        } catch (NumberFormatException e) {
            throw new ValidationException("R is not a number");
        }
    }
}
