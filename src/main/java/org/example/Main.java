package org.example;

import com.fastcgi.FCGIInterface;

import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        Response response = new Response();

        while(fcgiInterface.FCGIaccept() >= 0){
            String query = System.getProperties().getProperty("QUERY_STRING");
            RequestHandler handler = new RequestHandler(query);

            long startTime = System.nanoTime();
            String createdResponse = "";
            ArrayList<String> responses = new ArrayList<>();

            for(int i = 0; i < handler.getSizeR(); i++){
                boolean hit = calculate(handler.getX(), handler.getY(), handler.getR().get(i));
                createdResponse = response.createResponse(handler.getX(), handler.getY(), handler.getR().get(i), hit, startTime);
                responses.add(createdResponse);
            }

            String fullResponse = "[\n" + String.join(",\n", responses) + "\n]";

            try {
                response.sendResponse(fullResponse);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    private static boolean calculate(int x, float y, Integer r){
        //first
        if (x > 0 && y > 0){
            if(((x + y/2) - r/2) > 0){
                return false;
            }
        }
        //second
        if (x < 0 && y > 0){
            if(x*x + y*y > r*r){
                return false;
            }
        }
        //third
        if (x < 0 && y < 0){
            return false;
        }
        //fourth
        if (x > 0 && y < 0){
            if((x > r/2) && (y < -r)){
                return false;
            }
        }

        return true;
    }
}