package org.example;

import com.fastcgi.FCGIInterface;

public class Main {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();

        while(fcgiInterface.FCGIaccept() >= 0){
            Response response = new Response();

            long startTime = System.currentTimeMillis();

            String query = System.getProperties().getProperty("QUERY_STRING");
            RequestHandler handler = new RequestHandler(query);

            boolean hit = calculate(handler.getX(), handler.getY(), handler.getR());
            String createdResponse = response.createResponse(handler.getX(), handler.getY(), handler.getR(), hit, startTime);

            try {
                response.sendResponse(createdResponse);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    private static boolean calculate(int x, int y, int r){
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