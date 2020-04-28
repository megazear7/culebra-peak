package com.culebrapeak.core.services.impl;

import java.io.IOException;
import javax.servlet.ServletException;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
    private AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private TagManager tagManager;

    @Mock
    private Tag tag;

    private MyServiceImpl myServiceUnderTest;

    @BeforeEach
    void setUp() {
        context.registerService(TagManager.class, tagManager);
        myServiceUnderTest = context.registerInjectActivateService(new MyServiceImpl());
    }

    @Test
    void simpleTest() throws ServletException, IOException {
        assertEquals("A", myServiceUnderTest.exampleMethod1());
    }

    @Test
    void referenceTest() throws ServletException, IOException {
        when(tagManager.resolve("example")).thenReturn(tag);
        when(tag.getTitle()).thenReturn("Example");
        assertEquals("A", myServiceUnderTest.exampleMethod2());
    }
}
