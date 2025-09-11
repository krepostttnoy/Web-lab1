package org.example;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class RequestHandler {
    private final int x;
    private final int y;
    private final int r;

    public RequestHandler(String request){
        if (request == null || request.isEmpty()){
            throw new ValidationException("Request is empty.");
        }

        var params = splitter(request);
        validateParams(params);

        this.x = Integer.parseInt(params.get("x"));
        this.y = Integer.parseInt(params.get("y"));
        this.r = Integer.parseInt(params.get("r"));
    }

    private String validateParams(Map<String, String> params){
        String answer = "";
        try{
            Validator.validate(params);
        }catch (ValidationException e){
            answer = """
                   {
                       "error": "%s"
                   }
                   """.formatted(e.getMessage());
        }
        return answer;
    }
    private static Map<String, String> splitter(String request){
        Map<String, String> result = new HashMap<>();
        if (request == null || request.isEmpty()) return result;

        String[] pairs = request.split("&");

        for (String pair: pairs){
            String[] parts = pair.split("=", 2);
            String key = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
            String value;
            if(parts.length > 1) {
                value = URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
            }else{
                value = "";
            }
            result.put(key, value);
        }
        return result;
    }

    public int getX(){
        return x;
    }

    public int getY(){
        return y;
    }

    public int getR(){
        return r;
    }

}
