package com.culebrapeak.core.services.impl;

import com.culebrapeak.core.services.MyService;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = MyService.class, immediate = true)
public class MyServiceImpl implements MyService {

    @Reference
    private TagManager tagManager;

    public MyServiceImpl() { }

    public String exampleMethod1() {
        return "A";
    }

    public String exampleMethod2() {
        if (tagManager != null) {
            final Tag tag = tagManager.resolve("example");

            if (tag != null) {
                return tag.getTitle().equals("Example") ? "A" : "B";
            } else {
                return "C";
            }
        } else {
            return "D";
        }
    }
}