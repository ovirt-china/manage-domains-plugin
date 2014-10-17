package com.servlet.uiplugin.emd;
import javax.servlet.*;
import javax.servlet.http.*;

import java.io.*;

public class HelloWorld {
	private String defaultName = "Bernard";
	private String defaultGreeting = "你好";
	
	public void service(HttpServletRequest req, HttpServletResponse res)throws IOException
	{
		String name, paramName[];
		  if ((paramName = req.getParameterValues("name")) 
		      != null) {
		    name = paramName[0];
		  }
		  else {
		    name = defaultName;
		  }

		  // Set the content type first
		  res.setContentType("text/html");
		  // Obtain a PrintWriter as an output stream
		  PrintWriter out = res.getWriter();

		  out.print("<html><head><title>" + 
		              "Hello World!" + "</title></head>");
		  out.print("<body><h1>");
		  out.print(defaultGreeting + " " + name + "!");
		  out.print("</h1></body></html>");
	}
}
