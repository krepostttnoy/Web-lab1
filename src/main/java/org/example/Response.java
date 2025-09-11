package org.example;

import java.io.PrintStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Response {
    public String createResponse(int x, int y, int r, boolean hit, long startTime) {
        long executionTime = System.currentTimeMillis() - startTime;
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return String.format("{\"x\": %d, \"y\": %d, \"r\": %d, \"result\": %b, \"executionTime\": %dа, \"currentTime\": \"%s\"}",
                x, y, r, hit, executionTime, currentTime);
    }

    public void sendResponse(String response) {
        PrintStream out = System.out;

        out.println("Content-Type: application/json");
        out.println();

        out.println(response);
        out.flush();
    }
}
