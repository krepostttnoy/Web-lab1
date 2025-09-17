package org.example;

import java.awt.*;
import java.io.PrintStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Response {
    public String createResponse(int x, float y, Integer r, boolean hit, long startTime) {
        double executionTime = ((System.nanoTime() - startTime) / 1_000_000.0);
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return String.format(Locale.US,"""
                {
                  "x": %d,
                  "y": %.2f,
                  "r": %d,
                  "result": %b,
                  "execution_time": "%.2f ms",
                  "current_time": "%s"
                }
                """, x, y, r, hit, executionTime, currentTime);
    }

    public void sendResponse(String response) {
        PrintStream out = System.out;

        out.println("Content-Type: application/json\r");
        out.println();

        out.println(response);
        out.flush();
    }
}
